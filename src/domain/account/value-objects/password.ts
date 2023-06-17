import { InvalidParamError } from '../../../presentation/errors'
import { Either, left, right } from '../../../shared/either'
import { InvalidPasswordError } from '../../errors/invalid-password-error'

export class Password {
  private constructor (private readonly password: string) {
    Object.freeze(this)
  }

  static create (password: string): Either<InvalidParamError, Password> {
    if (!this.validate(password)) {
      return left(new InvalidPasswordError(password))
    }
    return right(new Password(password))
  }

  private static validate (password: string): boolean {
    if (!password) {
      return false
    }
    return true
  }
}
