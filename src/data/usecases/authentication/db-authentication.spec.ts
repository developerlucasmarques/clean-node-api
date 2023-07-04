import {
  AuthenticationError, AccountModel, AuthenticationData, LoadAccountByEmailError,
  DbAuthentication, HashComparer, HashCompareData,
  LoadAccountByEmailRepository, LoadAccountByEmailResponse, UpdateAccessToken
} from '.'
import { left, right } from '../../../shared/either'

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
    async loadAccountByEmail (email: string): Promise<LoadAccountByEmailResponse> {
      return await Promise.resolve(right(makeFakeAccountModel()))
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

const makeDbUpdateAccessTokenStub = (): UpdateAccessToken => {
  class UpdateAccessTokenStub implements UpdateAccessToken {
    async update (accountId: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new UpdateAccessTokenStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  dbUpdateAccessTokenStub: UpdateAccessToken
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparerStub()
  const dbUpdateAccessTokenStub = makeDbUpdateAccessTokenStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    dbUpdateAccessTokenStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    dbUpdateAccessTokenStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail')
    await sut.auth(makeFakeAuthenticationData())
    expect(loadAccountByEmailSpy).toHaveBeenLastCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AuthenticationError if LoadAccountByEmailRepository returns error', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail').mockReturnValueOnce(
      Promise.resolve(left(new LoadAccountByEmailError('invalid_email@mail.com')))
    )
    const authResult = await sut.auth(makeFakeAuthenticationData())
    expect(authResult.value).toEqual(new AuthenticationError())
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
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.auth(makeFakeAuthenticationData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return AuthenticationError if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const authResult = await sut.auth(makeFakeAuthenticationData())
    expect(authResult.value).toEqual(new AuthenticationError())
  })

  test('Should call DbUpdateAccessToken with correct account id', async () => {
    const { sut, dbUpdateAccessTokenStub } = makeSut()
    const updateSpy = jest.spyOn(dbUpdateAccessTokenStub, 'update')
    await sut.auth(makeFakeAuthenticationData())
    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccountModel().id)
  })
})
