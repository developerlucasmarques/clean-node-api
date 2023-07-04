import { UpdateAccessTokenRepository, Encrypter } from '.'
import { UpdateAccessToken } from '../../../domain/usecases/update-access-token'

export class DbUpdateAccessToken implements UpdateAccessToken {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async update (accountId: string): Promise<string> {
    const accessToken = await this.encrypter.encrypt(accountId)
    await this.updateAccessTokenRepository.updateAccessToken({ accountId, accessToken })
    return 'any_token'
  }
}
