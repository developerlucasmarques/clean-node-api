import { AccountData, AddAccountRepository, Hasher } from '.'
import { DbAddAccount } from './db-add-account'
import { left, right } from '../../../shared/either'
import { InvalidNameError, InvalidPasswordError, InvalidEmailError, Account } from '../../../domain/entities/account'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailError, LoadAccountByEmailRepository, LoadAccountByEmailResponse, UpdateAccessToken } from '../authentication'
import { EmailInUseError } from '../../errors/email-in-use-error'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => { resolve('hashed_password') })
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AccountData): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountRepositoryStub()
}

const makeUpdateAccessTokenStub = (): UpdateAccessToken => {
  class UpdateAccessTokenStub implements UpdateAccessToken {
    async update (accountId: string): Promise<string> {
      return await Promise.resolve('access_token')
    }
  }
  return new UpdateAccessTokenStub()
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadAccountByEmail (email: string): Promise<LoadAccountByEmailResponse> {
      return await Promise.resolve(left(new LoadAccountByEmailError('valid_email@mail.com')))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAccountData = (): AccountData => ({
  name: 'valid name',
  email: 'valid_email@mail.com',
  password: 'password1234'
})

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  updateAccessTokenStub: UpdateAccessToken
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const updateAccessTokenStub = makeUpdateAccessTokenStub()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, updateAccessTokenStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    updateAccessTokenStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Account with correct accout data', async () => {
    const { sut } = makeSut()
    const createSpy = jest.spyOn(Account, 'create')
    await sut.add(makeFakeAccountData())
    expect(createSpy).toHaveBeenCalledWith(makeFakeAccountData())
  })

  test('Should return InvalidNameError if Account return InvalidNameError', async () => {
    const { sut } = makeSut()
    jest.spyOn(Account, 'create').mockReturnValueOnce(
      left(new InvalidNameError('invalid name'))
    )
    const response = await sut.add(makeFakeAccountData())
    expect(response.value).toEqual(new InvalidNameError('invalid name'))
  })

  test('Should return InvalidEmailError if Account return InvalidEmailError', async () => {
    const { sut } = makeSut()
    jest.spyOn(Account, 'create').mockReturnValueOnce(
      left(new InvalidEmailError('invalid_email@mail.com'))
    )
    const response = await sut.add(makeFakeAccountData())
    expect(response.value).toEqual(new InvalidEmailError('invalid_email@mail.com'))
  })

  test('Should return InvalidPasswordError if Account return InvalidPasswordError', async () => {
    const { sut } = makeSut()
    jest.spyOn(Account, 'create').mockReturnValueOnce(
      left(new InvalidPasswordError('invalid_password1'))
    )
    const response = await sut.add(makeFakeAccountData())
    expect(response.value).toEqual(new InvalidPasswordError('invalid_password1'))
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail')
    await sut.add(makeFakeAccountData())
    expect(loadAccountByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('Should return EmailInUseError if an account with the email already exists', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail').mockReturnValueOnce(
      Promise.resolve(right(makeFakeAccount()))
    )
    const addResult = await sut.add(makeFakeAccountData())
    expect(addResult.value).toEqual(new EmailInUseError('valid_email@mail.com'))
  })

  test('Should call Hasher with correct passwod', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAccountData())
    expect(hashSpy).toHaveBeenCalledWith('password1234')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throws if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateAccessToken with correct account id', async () => {
    const { sut, updateAccessTokenStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenStub, 'update')
    await sut.add(makeFakeAccountData())
    expect(updateSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should throw if UpdateAccessToken throw', async () => {
    const { sut, updateAccessTokenStub } = makeSut()
    jest.spyOn(updateAccessTokenStub, 'update').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return access token if UpdateAccessToken success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.add(makeFakeAccountData())
    expect(accessToken.value).toBe('access_token')
  })
})
