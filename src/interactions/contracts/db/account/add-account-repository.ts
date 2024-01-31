import { AccountRole } from '@/domain/models'
import { AccountModel } from '@/domain/models/account'

export interface AccountDataRepository {
  name: string
  email: string
  password: string
  role: AccountRole
}

export interface AddAccountRepository {
  add: (accountData: AccountDataRepository) => Promise<AccountModel>
}
