import { InvalidParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/contracts'
import { Either, left, right } from '@/shared/either'

export class CompareFieldsValidation<T> implements Validation<T> {
  constructor (
    private readonly fieldName: keyof T,
    private readonly fieldToCompareName: keyof T
  ) {}

  validate (input: T): Either<Error, null> {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return left(new InvalidParamError(String(this.fieldToCompareName)))
    }
    return right(null)
  }
}
