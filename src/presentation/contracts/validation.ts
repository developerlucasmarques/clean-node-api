import { Either } from '@/shared/either'

export interface Validation<T> {
  validate: (input: T) => Either<Error, null>
}
