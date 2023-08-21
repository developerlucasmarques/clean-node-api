import { ValidationTypeError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'
import { Either, left, right } from '../../shared/either'

export class PrimitiveTypeValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldType: 'string' | 'number' | 'boolean') {
  }

  validate (input: any): Either<Error, null> {
    const fieldValue = input[this.fieldName]
    if (typeof fieldValue === this.fieldType) {
      return right(null)
    }
    return left(new ValidationTypeError(this.fieldName))
  }
}
