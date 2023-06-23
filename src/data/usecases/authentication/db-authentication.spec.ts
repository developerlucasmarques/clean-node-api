import { AuthenticationError } from '../../../domain/errors/authentication-error'
import { AccountModel } from '../../../domain/models/account'
import { AuthenticationData } from '../../../domain/usecases/authentication'
import { left, right } from '../../../shared/either'
import { LoadAccountByEmailError } from '../../errors/load-account-by-email-error'
import { HashComparer, HashComparerData } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository, LoadAccountByEmailResponse } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenData, UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
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

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async comparer (hashComparerData: HashComparerData): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (value: string): Promise<string> {
      return await Promise.resolve('access_token')
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (values: UpdateAccessTokenData): Promise<void> {
      Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparerStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
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

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'comparer')
    await sut.auth(makeFakeAuthenticationData())
    expect(comparerSpy).toHaveBeenCalledWith({
      value: makeFakeAuthenticationData().password,
      hash: makeFakeAccountModel().password
    })
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AuthenticationError if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer').mockReturnValueOnce(Promise.resolve(false))
    const authResult = await sut.auth(makeFakeAuthenticationData())
    expect(authResult.value).toEqual(new AuthenticationError())
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthenticationData())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return access token if TokenGenerator success', async () => {
    const { sut } = makeSut()
    const authResult = await sut.auth(makeFakeAuthenticationData())
    expect(authResult.value).toBe('access_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthenticationData())
    expect(updateSpy).toHaveBeenCalledWith({
      accountId: 'any_id',
      accessTokent: 'access_token'
    })
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })
})
