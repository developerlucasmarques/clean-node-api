import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByTokenRepository {
  loadByToken: (accessToken: string) => Promise<null | AccountModel>
}
