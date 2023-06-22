import { AuthenticationError } from '../../../domain/errors/authentication-error'
import { AccountModel } from '../../../domain/models/account'
import { AuthenticationData } from '../../../domain/usecases/authentication'
import { left, right } from '../../../shared/either'
import { LoadAccountByEmailError } from '../../errors/load-account-by-email-error'
import { LoadAccountByEmailRepository, LoadAccountByEmailResponse } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'password1234'
})

const makeFakeAuthenticationData = (): AuthenticationData => ({
  email: 'any_email@mail.com',
  password: 'password1234'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<LoadAccountByEmailResponse> {
      return await Promise.resolve(right(makeFakeAccountModel()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthenticationData())
    expect(loadSpy).toHaveBeenLastCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AuthenticationError if LoadAccountByEmailRepository returns error', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      Promise.resolve(left(new LoadAccountByEmailError('invalid_email@mail.com')))
    )
    const authResult = await sut.auth(makeFakeAuthenticationData())
    expect(authResult.value).toEqual(new AuthenticationError())
  })
})
