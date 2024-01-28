import { left, right } from '@/shared/either'
import { Email, Name, Password } from './value-objects'
import { InvalidEmailError, InvalidNameError, InvalidPasswordError } from './errors'
import { AccountData } from '@/domain/usecases/add-account'
import { Account } from './account'

jest.mock('@/domain/entities/account/value-objects/name', () => ({
  Name: {
    create: jest.fn(() => { return right({ name: 'any_name' }) })
  }
}))

jest.mock('@/domain/entities/account/value-objects/email', () => ({
  Email: {
    create: jest.fn(() => { return right({ email: 'any_email@mail.com' }) })
  }
}))

const makeFakeAccountData = (): AccountData => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'password1234'
})

describe('Account', () => {
  test('Should call Name with correct values', () => {
    const createNameSpy = jest.spyOn(Name, 'create')
    Account.create(makeFakeAccountData())
    expect(createNameSpy).toHaveBeenCalledWith('any_name')
  })

  test('Should return InvalidNameError if Name return InvalidNameError', () => {
    jest.spyOn(Name, 'create').mockReturnValueOnce(
      left(new InvalidNameError('invalid_name'))
    )
    const sut = Account.create(makeFakeAccountData())
    expect(sut.value).toEqual(new InvalidNameError('invalid_name'))
  })

  test('Should call Email with correct value', () => {
    const createEmailSpy = jest.spyOn(Email, 'create')
    Account.create(makeFakeAccountData())
    expect(createEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return InvalidEmailError if Email return InvalidEmailError', () => {
    jest.spyOn(Email, 'create').mockReturnValueOnce(
      left(new InvalidEmailError('invalid_email@mail.com'))
    )
    const sut = Account.create(makeFakeAccountData())
    expect(sut.value).toEqual(new InvalidEmailError('invalid_email@mail.com'))
  })

  test('Should call Password with correct value', () => {
    const createPasswordSpy = jest.spyOn(Password, 'create')
    Account.create(makeFakeAccountData())
    expect(createPasswordSpy).toHaveBeenCalledWith('password1234')
  })

  test('Should return InvalidPasswordError if Password return InvalidPasswordError', () => {
    jest.spyOn(Password, 'create').mockReturnValueOnce(
      left(new InvalidPasswordError('invalid_passowrd_1234'))
    )
    const sut = Account.create(makeFakeAccountData())
    expect(sut.value).toEqual(new InvalidPasswordError('invalid_passowrd_1234'))
  })

  test('Should return Account if values valid', () => {
    const sut = Account.create(makeFakeAccountData())
    expect(sut.value).toEqual({
      name: { name: 'any_name' },
      email: { email: 'any_email@mail.com' },
      password: { password: 'password1234' }
    })
  })
})
