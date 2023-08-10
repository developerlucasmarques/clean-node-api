import { Authentication, AuthenticationData, AuthenticationResponse, UpdateAccessToken } from '../../../../domain/usecases'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account'
import { HashComparer } from '../../../protocols/criptography'
import { AuthenticationError } from '../../../../domain/errors'
import { left, right } from '../../../../shared/either'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly updateAccessToken: UpdateAccessToken
  ) {}

  async auth (authenticationData: AuthenticationData): Promise<AuthenticationResponse> {
    const { email, password } = authenticationData
    const accountOrError = await this.loadAccountByEmailRepository.loadAccountByEmail(email)
    if (accountOrError.isLeft()) {
      return left(new AuthenticationError())
    }
    const comparerResult = await this.hashComparer.compare({
      value: password,
      hash: accountOrError.value.password
    })
    if (!comparerResult) {
      return left(new AuthenticationError())
    }
    const accessToken = await this.updateAccessToken.update(accountOrError.value.id)
    return right(accessToken)
  }
}
