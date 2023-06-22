import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
      class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load (email: string): Promise<AccountModel> {
          return await Promise.resolve({
            id: 'any_id',
            name: 'any name',
            email: 'any_email@mail.com',
            password: 'password1234'
          })
        }
      }
      return new LoadAccountByEmailRepositoryStub()
    }
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'password1234'
    })
    expect(loadSpy).toHaveBeenLastCalledWith('any_email@mail.com')
  })
})
