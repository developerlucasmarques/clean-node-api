import { UpdateAccessToken } from '@/domain/usecases'
import { Encrypter } from '@/data/protocols/criptography'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account'

export class DbUpdateAccessToken implements UpdateAccessToken {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async update (accountId: string): Promise<string> {
    const accessToken = await this.encrypter.encrypt(accountId)
    await this.updateAccessTokenRepository.updateAccessToken({ accountId, accessToken })
    return accessToken
  }
}
