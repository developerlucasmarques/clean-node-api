import { Either, left, right } from '../../../shared/either'
import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from './validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Either<Error, null> {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return left(new InvalidParamError(this.fieldName))
    }
    return right(null)
  }
}
