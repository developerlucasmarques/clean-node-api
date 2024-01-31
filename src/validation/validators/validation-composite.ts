import { Validation } from '@/presentation/contracts'
import { Either, left, right } from '@/shared/either'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

  validate (input: any): Either<Error, null> {
    for (const validation of this.validations) {
      const validationResult = validation.validate(input)
      if (validationResult.isLeft()) {
        return left(validationResult.value)
      }
    }
    return right(null)
  }
}
