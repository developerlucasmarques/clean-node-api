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
})
