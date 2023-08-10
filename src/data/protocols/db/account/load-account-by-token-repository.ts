import { LoadAccountByTokenData } from '../../../../domain/usecases'
import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByTokenRepository {
  loadByToken: (data: LoadAccountByTokenData) => Promise<null | AccountModel>
}
