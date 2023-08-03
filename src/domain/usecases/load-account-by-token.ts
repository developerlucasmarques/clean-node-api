import { Either } from '../../shared/either'
import { AccessDeniedError, InvalidTokenError } from '../errors'
import { AccountModel } from '../models/account'

export interface LoadAccountByTokenData {
  accessToken: string
  role?: 'admin' | 'user'
}

export type LoadAccountByTokenResponse = Either<InvalidTokenError | AccessDeniedError, AccountModel>

export interface LoadAccountByToken {
  load: (data: LoadAccountByTokenData) => Promise<LoadAccountByTokenResponse>
}
