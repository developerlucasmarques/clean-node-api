import { Either, left, right } from '../../shared/either'
import { InvalidNameError } from '../errors/invalid-name-error'
import { Name } from './value-objects/name'

export class Account {
  private constructor (
    private readonly name: Name
  ) {
    Object.freeze(this)
  }

  static create (nameData: string): Either<InvalidNameError, Account> {
    const nameOrError = Name.create(nameData)
    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }
    const name = nameOrError.value
    return right(new Account(name))
  }
}
