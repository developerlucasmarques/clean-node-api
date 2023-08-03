import { AccessDeniedError, InvalidTokenError } from '../../domain/errors'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken, LoadAccountByTokenData, LoadAccountByTokenResponse } from '../../domain/usecases'
import { left, right } from '../../shared/either'
import { AccessTokenNotInformedError } from '../errors'
import { forbidden, unauthorized } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (data: LoadAccountByTokenData): Promise<LoadAccountByTokenResponse> {
      return await Promise.resolve(right(makeFakeAccountModel()))
    }
  }
  return new LoadAccountByTokenStub()
}

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    loadAccountByTokenStub,
    sut
  }
}

describe('Auth Middleware', () => {
  test('Should return 401 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized(new AccessTokenNotInformedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return 401 if LoadAccountByToken returns a InvalidTokenError', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(
      Promise.resolve(left(new InvalidTokenError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized(new InvalidTokenError()))
  })

  test('Should return 403 if LoadAccountByToken returns a AccessDeniedError', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(
      Promise.resolve(left(new AccessDeniedError()))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
