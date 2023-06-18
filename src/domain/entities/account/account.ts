import { left, right } from '../../../shared/either'
import { AddAccountModel } from '../../usecases/add-account'
import { AccountResponse } from './account-response'
import { Email } from './value-objects/email'
import { Name } from './value-objects/name'
import { Password } from './value-objects/password'

export class Account {
  private constructor (
    private readonly name: Name,
    private readonly email: Email,
    private readonly password: Password
  ) {
    Object.freeze(this)
  }

  static create (accountData: AddAccountModel): AccountResponse {
    const nameOrError = Name.create(accountData.name)
    const emailOrError = Email.create(accountData.email)
    const passwordOrError = Password.create(accountData.password)
    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }
    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }
    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value)
    }
    const name = nameOrError.value
    const email = emailOrError.value
    const password = passwordOrError.value
    return right(new Account(name, email, password))
  }
}
