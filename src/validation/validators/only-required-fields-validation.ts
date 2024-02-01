import { UnnecessaryFieldError } from '@/presentation/errors'
import { Validation } from '@/presentation/contracts'
import { Either, left, right } from '@/shared/either'

export interface ListWithRequiredFields {
  listName: string
  listFields: string[]
}

export class OnlyRequiredFieldsValidation<T> implements Validation<T> {
  constructor (
    private readonly requiredFields: Array<keyof T>,
    private readonly listWithRequiredFields?: ListWithRequiredFields
  ) {}

  validate (input: T): Either<Error, null> {
    const keys = Object.keys(input as Array<keyof T>)
    for (const key of keys) {
      if (!this.requiredFields.includes(key as keyof T)) {
        return left(new UnnecessaryFieldError(String(key)))
      }
    }

    if (this.listWithRequiredFields) {
      const array = input[this.listWithRequiredFields.listName as keyof T] as Array<Record<string, any>>
      for (const object of array) {
        const objectKeys = Object.keys(object)
        for (const key of objectKeys) {
          if (!this.listWithRequiredFields.listFields.includes(key)) {
            return left(new UnnecessaryFieldError(String(key)))
          }
        }
      }
    }

    return right(null)
  }
}
