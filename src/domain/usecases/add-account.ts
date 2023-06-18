import { AccountModel } from '../models/account'

export interface AccountData {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (accountData: AccountData) => Promise<AccountModel>
}
