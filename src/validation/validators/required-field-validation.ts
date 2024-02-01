import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/contracts'
import { Either, left, right } from '@/shared/either'

export class RequiredFieldValidation<T> implements Validation<T> {
  constructor (private readonly fieldName: keyof T) {}

  validate (input: T): Either<Error, null> {
    if (!input[this.fieldName]) {
      return left(new MissingParamError(String(this.fieldName)))
    }
    return right(null)
  }
}
