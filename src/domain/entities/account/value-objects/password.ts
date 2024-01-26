import { Either, left, right } from '@/shared/either'
import { InvalidPasswordError } from '../errors/invalid-password-error'

export class Password {
  private constructor (private readonly password: string) {
    Object.freeze(this)
  }

  static create (password: string): Either<InvalidPasswordError, Password> {
    if (!this.validate(password)) {
      return left(new InvalidPasswordError(password))
    }
    return right(new Password(password))
  }

  private static validate (password: string): boolean {
    if (!password || password.length < 8 || password.length > 128) {
      return false
    }
    const regexTester = /^(?=.*[a-zA-Z])(?=.*\d).+$/
    if (!regexTester.test(password)) {
      return false
    }
    return true
  }
}
