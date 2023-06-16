import { Either, left, right } from '../../shared/either'
import { InvalidNameError } from '../errors/invalid-name-error'

export class Name {
  private constructor (private readonly name: string) {
    Object.freeze(this)
  }

  static create (name: string): Either<InvalidNameError, Name> {
    if (!Name.validade(name)) {
      return left(new InvalidNameError(name))
    }
    return right(new Name(name))
  }

  static validade (name: string): boolean {
    if (name.length < 3) {
      return false
    }
    return true
  }
}