import { UnnecessaryFieldError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'
import { Either, left, right } from '../../shared/either'

export class OnlyRequiredFieldsValidation implements Validation {
  constructor (private readonly requiredFields: string[]) {}

  validate (input: any): Either<Error, null> {
    const keys = Object.keys(input)
    for (const key of keys) {
      if (!this.requiredFields.includes(key)) {
        return left(new UnnecessaryFieldError(key))
      }
    }
    return right(null)
  }
}
