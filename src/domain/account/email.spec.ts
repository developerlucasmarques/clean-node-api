import { InvalidEmailError } from '../errors/invalid-email-error'
import { Email } from './email'

describe('Email Value Object', () => {
  test('Should return InvalidEmailError if email not provided', () => {
    const sut = Email.create('')
    expect(sut.value).toEqual(new InvalidEmailError(''))
  })

  test('Should return InvalidEmailError if email without the at-sign', () => {
    const sut = Email.create('any_emailmail.com')
    expect(sut.value).toEqual(new InvalidEmailError('any_emailmail.com'))
  })

  test('Should return InvalidEmailError if email more than 64 chars on account part', () => {
    const accountPart = 'a'.repeat(65)
    const email = accountPart + '@mail.com'
    const sut = Email.create(email)
    expect(sut.value).toEqual(new InvalidEmailError(email))
  })

  test('Should return InvalidEmailError if email empty local part', () => {
    const sut = Email.create('@mail.com')
    expect(sut.value).toEqual(new InvalidEmailError('@mail.com'))
  })
})
