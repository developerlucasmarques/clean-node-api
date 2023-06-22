import { AccountModel } from '../../../domain/models/account'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'password1234'
})

const makeFakeAuthenticationData = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'password1234'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthenticationData())
    expect(loadSpy).toHaveBeenLastCalledWith('any_email@mail.com')
  })
})
