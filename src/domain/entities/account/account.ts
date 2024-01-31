import { left, right } from '@/shared/either'
import { Email, Name, Password } from './value-objects'
import { AccountResponse } from '.'
import { AccountData } from '@/domain/contracts/account/add-account'

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
    for (const result of [nameOrError, emailOrError, passwordOrError]) {
      if (result.isLeft()) return left(result.value)
    }
    return right(
      new Account(
        nameOrError.value as Name,
        emailOrError.value as Email,
        passwordOrError.value as Password
      )
    )
  }
}
