import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
import { HashCompareData } from '@/interactions/contracts/criptography'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise((resolve) => {
      resolve('hash')
    })
  },

  async compare (): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

const makeHashCompareData = (): HashCompareData => ({
  value: 'any_value',
  hash: 'any_hash'
})

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    test('Should throw if bcrypt throws', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash') as unknown as jest.Mock<
      ReturnType<(key: Error) => Promise<Error>>,
      Parameters<(key: Error) => Promise<Error>>
      >
      hashSpy.mockReturnValueOnce(
        new Promise((resolve, reject) => {
          reject(new Error())
        })
      )
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const comparerSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare(makeHashCompareData())
      expect(comparerSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock<
      ReturnType<(key: false) => Promise<boolean>>,
      Parameters<(key: false) => Promise<boolean>>
      >
      compareSpy.mockReturnValueOnce(Promise.resolve(false))
      const compareResult = await sut.compare(makeHashCompareData())
      expect(compareResult).toBe(false)
    })

    test('Should throw if bcrypt throws', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock<
      ReturnType<(key: Error) => Promise<Error>>,
      Parameters<(key: Error) => Promise<Error>>
      >
      compareSpy.mockReturnValueOnce(
        new Promise((resolve, reject) => {
          reject(new Error())
        })
      )
      const promise = sut.compare(makeHashCompareData())
      await expect(promise).rejects.toThrow()
    })

    test('Shoul return true when compare succeeds', async () => {
      const sut = makeSut()
      const compareResult = await sut.compare(makeHashCompareData())
      expect(compareResult).toBe(true)
    })
  })
})
