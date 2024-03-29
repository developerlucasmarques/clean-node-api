import { DbAuthentication } from './db-authentication'
import { AuthenticationError } from '@/domain/errors'
import { AccountModel } from '@/domain/models/account'
import { AuthenticationData, UpdateAccessToken } from '@/domain/contracts'
import { left, right } from '@/shared/either'
import { HashCompareData, HashComparer } from '@/interactions/contracts/criptography'
import { LoadAccountByEmailRepository } from '@/interactions/contracts/db'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'admin'
})

const makeFakeAuthenticationData = (): AuthenticationData => ({
  email: 'any_email@mail.com',
  password: 'password1234'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<null | AccountModel> {
      return await Promise.resolve(makeFakeAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (hashCompareData: HashCompareData): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeUpdateAccessTokenStub = (): UpdateAccessToken => {
  class UpdateAccessTokenStub implements UpdateAccessToken {
    async update (accountId: string): Promise<string> {
      return await Promise.resolve('access_token')
    }
  }
  return new UpdateAccessTokenStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  updateAccessTokenStub: UpdateAccessToken
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparerStub()
  const updateAccessTokenStub = makeUpdateAccessTokenStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    updateAccessTokenStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    updateAccessTokenStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadAccountByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )
    await sut.auth(makeFakeAuthenticationData())
    expect(loadAccountByEmailSpy).toHaveBeenLastCalledWith(
      'any_email@mail.com'
    )
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => {
          reject(new Error())
        })
      )
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AuthenticationError if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.resolve(null))
    const authResult = await sut.auth(makeFakeAuthenticationData())
    expect(authResult).toEqual(left(new AuthenticationError()))
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticationData())
    expect(comparerSpy).toHaveBeenCalledWith({
      value: makeFakeAuthenticationData().password,
      hash: makeFakeAccountModel().password
    })
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AuthenticationError if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))
    const authResult = await sut.auth(makeFakeAuthenticationData())
    expect(authResult).toEqual(left(new AuthenticationError()))
  })

  test('Should call UpdateAccessToken with correct account id', async () => {
    const { sut, updateAccessTokenStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenStub, 'update')
    await sut.auth(makeFakeAuthenticationData())
    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccountModel().id)
  })

  test('Should throw if UpdateAccessToken throws', async () => {
    const { sut, updateAccessTokenStub } = makeSut()
    jest
      .spyOn(updateAccessTokenStub, 'update')
      .mockImplementationOnce(async () => {
        return await Promise.reject(new Error())
      })
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return access token if UpdateAccessToken success', async () => {
    const { sut } = makeSut()
    const authResult = await sut.auth(makeFakeAuthenticationData())
    expect(authResult).toEqual(right('access_token'))
  })
})
