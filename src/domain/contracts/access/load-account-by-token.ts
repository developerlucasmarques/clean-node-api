import { Either } from '@/shared/either'
import { AccessDeniedError, InvalidTokenError, AccountNotFoundError } from '@/domain/errors'
import { AccountModel, AccountRole } from '@/domain/models'

export interface LoadAccountByTokenData {
  accessToken: string
  role?: AccountRole
}

export type LoadAccountByTokenResponse = Either<InvalidTokenError | AccessDeniedError | AccountNotFoundError, AccountModel>

export interface LoadAccountByToken {
  load: (data: LoadAccountByTokenData) => Promise<LoadAccountByTokenResponse>
}
