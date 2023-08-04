import { InvalidTokenError } from '../../../domain/errors'
import { LoadAccountByTokenData } from '../../../domain/usecases'
import { left } from '../../../shared/either'
import { Decrypter } from '../../protocols/criptography'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../authentication'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return await Promise.resolve('any_id')
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (data: LoadAccountByTokenData): Promise<null | AccountModel> {
      return await Promise.resolve(makeFakeAccountModel())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeFakeLoadAccountByTokenData = (): LoadAccountByTokenData => ({
  accessToken: 'any_token',
  role: 'admin'
})

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load(makeFakeLoadAccountByTokenData())
    expect(decryptSpy).toBeCalledWith('any_token')
  })

  test('Should return InvalidTokenError if Decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const loadResult = await sut.load(makeFakeLoadAccountByTokenData())
    expect(loadResult).toEqual(left(new InvalidTokenError()))
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load(makeFakeLoadAccountByTokenData())
    expect(loadByTokenSpy).toBeCalledWith({ accessToken: 'any_token', role: 'admin' })
  })
})
