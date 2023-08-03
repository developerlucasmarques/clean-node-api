import { left, right } from '../../../shared/either'
import { Email, Name, Password } from './value-objects'
import { AccountResponse } from '.'
import { AccountData } from '../../usecases/add-account'

export class Account {
  private constructor (
    private readonly name: Name,
    private readonly email: Email,
    private readonly password: Password
  ) {
    Object.freeze(this)
  }

  static create (accountData: AccountData): AccountResponse {
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
