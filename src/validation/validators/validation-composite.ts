import { Validation } from '@/presentation/contracts'
import { Either, left, right } from '@/shared/either'

export class ValidationComposite<T> implements Validation<T> {
  constructor (private readonly validations: Array<Validation<T>>) {}

  validate (input: T): Either<Error, null> {
    for (const validation of this.validations) {
      const validationResult = validation.validate(input)
      if (validationResult.isLeft()) {
        return left(validationResult.value)
      }
    }
    return right(null)
  }
}
