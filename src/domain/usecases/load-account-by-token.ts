import { Either } from '../../shared/either'
import { AccessDeniedError, InvalidTokenError } from '../errors'
import { AccountModel } from '../models/account'

export type AccountRole = 'admin' | 'user'

export interface LoadAccountByTokenData {
  accessToken: string
  role?: AccountRole
}

export type LoadAccountByTokenResponse = Either<InvalidTokenError | AccessDeniedError, AccountModel>

export interface LoadAccountByToken {
  load: (data: LoadAccountByTokenData) => Promise<LoadAccountByTokenResponse>
}
