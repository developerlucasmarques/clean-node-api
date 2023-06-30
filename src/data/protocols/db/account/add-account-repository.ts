import { AccountModel } from '../../../../domain/models/account'
import { AccountData } from '../../../../domain/usecases/add-account'

export interface AddAccountRepository {
  add: (accountData: AccountData) => Promise<AccountModel>
}
