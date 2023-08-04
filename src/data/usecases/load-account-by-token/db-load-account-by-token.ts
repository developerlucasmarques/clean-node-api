import { InvalidTokenError } from '../../../domain/errors'
import { LoadAccountByToken, LoadAccountByTokenData, LoadAccountByTokenResponse } from '../../../domain/usecases'
import { left, right } from '../../../shared/either'
import { Decrypter } from '../../protocols/criptography'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}

  async load (data: LoadAccountByTokenData): Promise<LoadAccountByTokenResponse> {
    const idOrNull = await this.decrypter.decrypt(data.accessToken)
    if (!idOrNull) {
      return left(new InvalidTokenError())
    }
    return right({
      id: 'id',
      email: 'email',
      name: 'name',
      password: '123'
    })
  }
}
