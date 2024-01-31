import { EmailInUseError } from '@/domain/errors'
import { Either } from '@/shared/either'
import { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '../entities/account/errors'

export interface AccountData {
  name: string
  email: string
  password: string
}

export type AddAccountResponse = Either<InvalidNameError | InvalidEmailError | InvalidPasswordError | EmailInUseError, string>

export interface AddAccount {
  add: (accountData: AccountData) => Promise<AddAccountResponse>
}
