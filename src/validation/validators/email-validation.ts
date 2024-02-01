import { InvalidEmailError } from '@/presentation/errors'
import { Validation } from '@/presentation/contracts'
import { Either, left, right } from '@/shared/either'
import { EmailValidator } from '../contracts/email-validator'

export class EmailValidation<T> implements Validation<T> {
  constructor (
    private readonly fieldName: keyof T,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: T): Either<Error, null> {
    const isValid = this.emailValidator.isValid(String(input[this.fieldName]))
    if (!isValid) {
      return left(new InvalidEmailError(String(input[this.fieldName])))
    }
    return right(null)
  }
}
