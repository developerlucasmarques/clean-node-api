import { AccountData, AddAccountRepository, Encrypter } from '.'
import { DbAddAccount } from './db-add-account'
import { Account } from '../../../domain/entities/account/account'
import { left } from '../../../shared/either'
import { InvalidNameError } from '../../../domain/entities/account/errors/invalid-name-error'
import { AccountModel } from '../../../domain/models/account'
import { InvalidEmailError } from '../../../presentation/errors'
import { InvalidPasswordError } from '../../../domain/entities/account'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AccountData): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountRepositoryStub()
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
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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

  test('Should call Encrypter with correct passwod', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('password1234')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.add(makeFakeAccountData())
    expect(promise).rejects.toThrow()
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
    expect(promise).rejects.toThrow()
  })

  test('Shound return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account.value).toEqual(makeFakeAccount())
  })
})
