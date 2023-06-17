import { Either, left, right } from '../../shared/either'
import { InvalidNameError } from '../errors/invalid-name-error'
import { AddAccountModel } from '../usecases/add-account'
import { Email } from './value-objects/email'
import { Name } from './value-objects/name'
import { Password } from './value-objects/password'

export class Account {
  private constructor (
    private readonly name: Name
  ) {
    Object.freeze(this)
  }

  static create (accountData: AddAccountModel): Either<InvalidNameError, Account> {
    const nameOrError = Name.create(accountData.name)
    const emailOrError = Email.create(accountData.email)
    Password.create(accountData.password)
    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }
    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }
    const name = nameOrError.value
    return right(new Account(name))
  }
}
