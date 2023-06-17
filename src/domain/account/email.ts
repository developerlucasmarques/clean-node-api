import { Either, left, right } from '../../shared/either'
import { InvalidEmailError } from '../errors/invalid-email-error'

export class Email {
  private constructor (private readonly email: string) {}

  static create (email: string): Either<InvalidEmailError, Email> {
    if (!this.validate(email)) {
      return left(new InvalidEmailError(email))
    }
    return right(new Email(email))
  }

  private static validate (email: string): boolean {
    const regexTester = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
    if (!regexTester.test(email)) {
      return false
    }
    return true
  }
}
