import { UpdateAccessToken } from '../../../domain/usecases/update-access-token'
import { Encrypter } from '../../protocols/criptography/encrypter'

export class DbUpdateAccessToken implements UpdateAccessToken {
  constructor (private readonly encrypter: Encrypter) {}

  async update (accountId: string): Promise<string> {
    await this.encrypter.encrypt(accountId)
    return 'any_token'
  }
}
