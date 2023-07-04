import {
  AuthenticationError, AuthenticationData, HashComparer,
  LoadAccountByEmailRepository, Authentication,
  AuthenticationResponse,
  UpdateAccessToken
} from '.'
import { left, right } from '../../../shared/either'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly dbUpdateAccessToken: UpdateAccessToken
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
    await this.dbUpdateAccessToken.update(accountOrError.value.id)
    return right('token')
  }
}
