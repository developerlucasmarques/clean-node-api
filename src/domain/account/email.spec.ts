import { InvalidEmailError } from '../errors/invalid-email-error'
import { Email } from './email'

describe('Email Value Object', () => {
  test('Should return InvalidEmailError if email without the at-sign', () => {
    const sut = Email.create('any_emailmail.com')
    expect(sut.value).toEqual(new InvalidEmailError('any_emailmail.com'))
  })
})
