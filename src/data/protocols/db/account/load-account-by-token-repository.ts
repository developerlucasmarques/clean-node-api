import { LoadAccountByTokenData } from '../../../../domain/usecases'
import { AccountModel } from '../../../usecases/authentication'

export interface LoadAccountByTokenRepository {
  loadByToken: (data: LoadAccountByTokenData) => Promise<null | AccountModel>
}
