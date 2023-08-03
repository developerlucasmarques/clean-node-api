import { AccountModel } from '../models/account'

export interface LoadAccountByTokenData {
  accessToken: string
  role?: 'admin' | 'user'
}

export interface LoadAccountByToken {
  load: (data: LoadAccountByTokenData) => Promise<AccountModel>
}
