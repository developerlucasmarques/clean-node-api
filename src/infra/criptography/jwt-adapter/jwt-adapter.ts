import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/usecases/authentication'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secretKey, { expiresIn: '24h' })
    return token
  }
}
