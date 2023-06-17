import { InvalidPasswordError } from '../../errors/invalid-password-error'
import { Password } from './password'

describe('Password Value Object', () => {
  test('Should return InvalidPasswordError if password not provided', () => {
    const sut = Password.create('')
    expect(sut.value).toEqual(new InvalidPasswordError(''))
  })

  test('Should return InvalidPasswordError if password is less than 8 characters', () => {
    const sut = Password.create('abc1234')
    expect(sut.value).toEqual(new InvalidPasswordError('abc1234'))
  })

  test('Should return InvalidPasswordError if password is more than 128 characters', () => {
    const password = 'a1'.repeat(65)
    const sut = Password.create(password)
    expect(sut.value).toEqual(new InvalidPasswordError(password))
  })
})
