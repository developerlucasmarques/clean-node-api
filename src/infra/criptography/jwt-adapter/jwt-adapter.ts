import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/usecases/authentication'
import { Decrypter } from '../../../data/protocols/criptography'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secretKey, { expiresIn: '24h' })
    return token
  }

  async decrypt (token: string): Promise<null | string > {
    jwt.verify(token, this.secretKey)
    return null
  }
}
