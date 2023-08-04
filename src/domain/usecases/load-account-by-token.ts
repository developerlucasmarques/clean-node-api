import { Either } from '../../shared/either'
import { AccessDeniedError, InvalidTokenError } from '../errors'
import { AccountModel } from '../models/account'
import { AccountRole } from '../models/account-role'

export interface LoadAccountByTokenData {
  accessToken: string
  role?: AccountRole
}

export type LoadAccountByTokenResponse = Either<InvalidTokenError | AccessDeniedError, AccountModel>

export interface LoadAccountByToken {
  load: (data: LoadAccountByTokenData) => Promise<LoadAccountByTokenResponse>
}
