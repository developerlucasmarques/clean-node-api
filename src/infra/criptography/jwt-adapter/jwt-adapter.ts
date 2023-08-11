import jwt from 'jsonwebtoken'
import { Decrypter, Encrypter } from '../../../data/protocols/criptography'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secretKey, { expiresIn: '24h' })
    return token
  }

  async decrypt (token: string): Promise<null | string > {
    try {
      const decryptedValue: any = jwt.verify(token, this.secretKey)
      return decryptedValue
    } catch (error: any) {
      console.error(error)
      for (const name of ['JsonWebTokenError', 'NotBeforeError', 'TokenExpiredError', 'SyntaxError']) {
        if (error.name === name) {
          return null
        }
      }
      throw new Error(error.message)
    }
  }
}
