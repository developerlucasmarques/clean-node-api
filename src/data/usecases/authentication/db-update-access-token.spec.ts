import { Encrypter, DbUpdateAccessToken } from '.'

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

interface SutTypes {
  sut: DbUpdateAccessToken
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbUpdateAccessToken(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('UpdateAccessToken UseCase', () => {
  test('Should call Encrypter with correct account id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    sut.update('account_id')
    expect(encryptSpy).toHaveBeenCalledWith('account_id')
  })
})
