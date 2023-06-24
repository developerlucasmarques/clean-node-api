import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'value_encryt'
  }
}))

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('any_secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret', { expiresIn: '24h' })
  })

  test('Should throw if sign throws', async () => {
    const sut = new JwtAdapter('any_secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
