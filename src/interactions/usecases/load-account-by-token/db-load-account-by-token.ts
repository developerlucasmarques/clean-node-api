import { AccessDeniedError, AccountNotFoundError, InvalidTokenError } from '@/domain/errors'
import { LoadAccountByToken, LoadAccountByTokenData, LoadAccountByTokenResponse } from '@/domain/contracts'
import { left, right } from '@/shared/either'
import { Decrypter } from '@/interactions/protocols/criptography'
import { LoadAccountByTokenRepository } from '@/interactions/protocols/db/account'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (data: LoadAccountByTokenData): Promise<LoadAccountByTokenResponse> {
    const idOrNull = await this.decrypter.decrypt(data.accessToken)
    if (!idOrNull) {
      return left(new InvalidTokenError())
    }
    const account = await this.loadAccountByTokenRepository.loadByToken(data.accessToken)
    if (!account) {
      return left(new AccountNotFoundError())
    }
    if (data.role && account.role !== 'admin') {
      if (data.role !== account.role) {
        return left(new AccessDeniedError())
      }
    }
    return right(account)
  }
}
