import { UpdateAccessToken } from '@/domain/contracts'
import { Encrypter } from '@/interactions/contracts/criptography'
import { UpdateAccessTokenRepository } from '@/interactions/contracts/db/account'

export class DbUpdateAccessToken implements UpdateAccessToken {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async update (accountId: string): Promise<string> {
    const accessToken = await this.encrypter.encrypt(accountId)
    await this.updateAccessTokenRepository.updateAccessToken({
      accountId,
      accessToken
    })
    return accessToken
  }
}
