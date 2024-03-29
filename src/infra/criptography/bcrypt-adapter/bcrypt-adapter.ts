import { Hasher } from '@/interactions/contracts/criptography/hasher'
import bcrypt from 'bcrypt'
import {
  HashComparer,
  HashCompareData
} from '@/interactions/contracts/criptography'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (hashCompareData: HashCompareData): Promise<boolean> {
    const comparer = await bcrypt.compare(
      hashCompareData.value,
      hashCompareData.hash
    )
    return comparer
  }
}
