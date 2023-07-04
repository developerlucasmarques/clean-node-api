import { Encrypter, DbUpdateAccessToken } from '.'

describe('UpdateAccessToken UseCase', () => {
  test('Should call Encrypter with correct account id', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await Promise.resolve('any_token')
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbUpdateAccessToken(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    sut.update('account_id')
    expect(encryptSpy).toHaveBeenCalledWith('account_id')
  })
})
