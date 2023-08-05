import { AccessDeniedError, InvalidTokenError } from '../../../domain/errors'
import { LoadAccountByToken, LoadAccountByTokenData, LoadAccountByTokenResponse } from '../../../domain/usecases'
import { left, right } from '../../../shared/either'
import { Decrypter } from '../../protocols/criptography'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

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
    const accountOrNull = await this.loadAccountByTokenRepository.loadByToken(data)
    if (!accountOrNull) {
      return left(new InvalidTokenError())
    }
    if (data.role && data.role !== accountOrNull.role) {
      return left(new AccessDeniedError())
    }
    return right({
      id: 'id',
      email: 'email',
      name: 'name',
      password: '123',
      role: 'admin'
    })
  }
}
