import { AccessDeniedError, AccountNotFoundError, InvalidTokenError } from '../../../domain/errors'
import { AccountModel, AccountRole } from '../../../domain/models'
import { LoadAccountByTokenData } from '../../../domain/usecases'
import { left, right } from '../../../shared/either'
import { Decrypter } from '../../protocols/criptography'
import { LoadAccountByTokenRepository } from '../../protocols/db/account'
import { DbLoadAccountByToken } from '.'

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
    async loadByToken (accessToken: string): Promise<null | AccountModel> {
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
  password: 'hashed_password',
  role: 'admin'
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
    expect(loadByTokenSpy).toBeCalledWith('any_token')
  })

  test('Should return AccountNotFoundError if LoadAccountByTokenRepository return null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const loadResult = await sut.load(makeFakeLoadAccountByTokenData())
    expect(loadResult).toEqual(left(new AccountNotFoundError()))
  })

  test('Should return AccessDeniedError if the role is different from the one passed in the data', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(
      Promise.resolve({
        id: 'any_id',
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'hashed_password',
        role: 'user'
      })
    )
    const loadResult = await sut.load(makeFakeLoadAccountByTokenData())
    expect(loadResult).toEqual(left(new AccessDeniedError()))
  })

  test('Should return an account if the access permission is user and the account is admin', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const role: AccountRole = 'admin'
    const accountModel = {
      id: 'any_id',
      name: 'any name',
      email: 'any_email@mail.com',
      accessToken: 'access_token',
      password: 'hashed_password',
      role
    }
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(
      Promise.resolve(accountModel)
    )
    const account = await sut.load({ accessToken: 'access_token', role: 'user' })
    expect(account).toEqual(right(accountModel))
  })

  test('Should return an Account if validations on success', async () => {
    const { sut } = makeSut()
    const loadResult = await sut.load(makeFakeLoadAccountByTokenData())
    expect(loadResult).toEqual(right(makeFakeAccountModel()))
  })
})
