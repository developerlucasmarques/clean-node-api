import { ValidationTypeError } from '@/presentation/errors'
import { Validation } from '@/presentation/contracts'
import { Either, left, right } from '@/shared/either'

export class PrimitiveTypeValidation<T> implements Validation<T> {
  constructor (
    private readonly fieldName: keyof T,
    private readonly fieldType: 'string' | 'number' | 'boolean' | 'array') {
  }

  validate (input: T): Either<Error, null> {
    const fieldValue = input[this.fieldName]
    if (this.fieldType === 'array') {
      if (fieldValue instanceof Array) {
        return right(null)
      } else {
        return left(new ValidationTypeError(String(this.fieldName)))
      }
    }
    if (typeof fieldValue === this.fieldType) {
      return right(null)
    }
    return left(new ValidationTypeError(String(this.fieldName)))
  }
}
