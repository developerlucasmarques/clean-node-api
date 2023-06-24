import {
  AuthenticationError, AuthenticationData, HashComparer, Encrypter,
  LoadAccountByEmailRepository, UpdateAccessTokenRepository, Authentication,
  AuthenticationResponse
} from '.'
import { left, right } from '../../../shared/either'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
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
    const token = await this.encrypter.encrypt(accountOrError.value.id)
    await this.updateAccessTokenRepository.updateAccessToken({
      accountId: accountOrError.value.id,
      accessTokent: token
    })
    return right(token)
  }
}
