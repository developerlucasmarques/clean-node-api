import { Either } from '../../shared/either'
import { InvalidEmailError } from '../entities/account/errors/invalid-email-error'
import { InvalidNameError } from '../entities/account/errors/invalid-name-error'
import { InvalidPasswordError } from '../entities/account/errors/invalid-password-error'
import { AccountModel } from '../models/account'

export interface AccountData {
  name: string
  email: string
  password: string
}

export type AddAccountResponse = Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, AccountModel>

export interface AddAccount {
  add: (accountData: AccountData) => Promise<AddAccountResponse>
}
