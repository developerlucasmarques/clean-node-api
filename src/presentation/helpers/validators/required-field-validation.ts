import { Validation, MissingParamError } from '.'
import { Either, left, right } from '@/shared/either'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Either<Error, null> {
    if (!input[this.fieldName]) {
      return left(new MissingParamError(this.fieldName))
    }
    return right(null)
  }
}
