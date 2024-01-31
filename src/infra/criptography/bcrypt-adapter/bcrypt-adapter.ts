import { Hasher } from '@/interactions/protocols/criptography/hasher'
import bcrypt from 'bcrypt'
import { HashComparer, HashCompareData } from '@/interactions/protocols/criptography'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (hashCompareData: HashCompareData): Promise<boolean> {
    const comparer = await bcrypt.compare(hashCompareData.value, hashCompareData.hash)
    return comparer
  }
}
