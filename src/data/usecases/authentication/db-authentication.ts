import { AuthenticationError } from '../../../domain/errors/authentication-error'
import { Authentication, AuthenticationData, AuthenticationResponse } from '../../../domain/usecases/authentication'
import { left, right } from '../../../shared/either'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (authenticationData: AuthenticationData): Promise<AuthenticationResponse> {
    const { email, password } = authenticationData
    const accountOrError = await this.loadAccountByEmailRepository.load(email)
    if (accountOrError.isLeft()) {
      return left(new AuthenticationError())
    }
    const comparerResult = await this.hashComparer.comparer({
      value: password,
      hash: accountOrError.value.password
    })
    if (!comparerResult) {
      return left(new AuthenticationError())
    }
    return right('access_token')
  }
}
