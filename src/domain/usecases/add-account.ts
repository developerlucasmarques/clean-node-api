import { Either } from '../../shared/either'
import { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '../entities/account'
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
