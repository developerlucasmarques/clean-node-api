import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/usecases/authentication'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (value: string): Promise<string> {
    jwt.sign({ id: value }, this.secretKey, { expiresIn: '24h' })
    return await Promise.resolve('string')
  }
}
