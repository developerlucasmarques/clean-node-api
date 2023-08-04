import { LoadAccountByToken, LoadAccountByTokenData, LoadAccountByTokenResponse } from '../../../domain/usecases'
import { right } from '../../../shared/either'
import { Decrypter } from '../../protocols/criptography'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}

  async load (data: LoadAccountByTokenData): Promise<LoadAccountByTokenResponse> {
    await this.decrypter.decrypt(data.accessToken)

    return right({
      id: 'id',
      email: 'email',
      name: 'name',
      password: '123'
    })
  }
}
