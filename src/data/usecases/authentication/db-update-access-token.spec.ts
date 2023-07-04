import { Encrypter, DbUpdateAccessToken, UpdateAccessTokenRepository, UpdateAccessTokenData } from '.'

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (values: UpdateAccessTokenData): Promise<void> {
      Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbUpdateAccessToken
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbUpdateAccessToken(encrypterStub, updateAccessTokenRepositoryStub)
  return {
    sut,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('UpdateAccessToken UseCase', () => {
  test('Should call Encrypter with correct account id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    sut.update('account_id')
    expect(encryptSpy).toHaveBeenCalledWith('account_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const promise = sut.update('account_id')
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.update('account_id')
    expect(updateAccessTokenSpy).toHaveBeenCalledWith({
      accountId: 'account_id',
      accessToken: 'any_token'
    })
  })
})
