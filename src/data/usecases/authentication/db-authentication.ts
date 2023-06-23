import { AuthenticationError } from '../../../domain/errors/authentication-error'
import { Authentication, AuthenticationData, AuthenticationResponse } from '../../../domain/usecases/authentication'
import { left, right } from '../../../shared/either'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
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
    const token = await this.tokenGenerator.generate(accountOrError.value.id)
    await this.updateAccessTokenRepository.update({
      accountId: accountOrError.value.id,
      accessTokent: token
    })
    return right(token)
  }
}
