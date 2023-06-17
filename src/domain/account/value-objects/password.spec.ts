import { InvalidPasswordError } from '../../errors/invalid-password-error'
import { Password } from './password'

describe('Password Value Object', () => {
  test('Should return InvalidPasswordError if password not provided', () => {
    const sut = Password.create('')
    expect(sut.value).toEqual(new InvalidPasswordError(''))
  })
})
