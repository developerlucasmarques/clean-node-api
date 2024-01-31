import { Authentication, AuthenticationData, AuthenticationResponse, UpdateAccessToken } from '@/domain/contracts'
import { LoadAccountByEmailRepository } from '@/interactions/contracts/db'
import { HashComparer } from '@/interactions/contracts/criptography'
import { AuthenticationError } from '@/domain/errors'
import { left, right } from '@/shared/either'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly updateAccessToken: UpdateAccessToken
  ) {}

  async auth (authenticationData: AuthenticationData): Promise<AuthenticationResponse> {
    const { email, password } = authenticationData
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) {
      return left(new AuthenticationError())
    }
    const comparerResult = await this.hashComparer.compare({
      value: password,
      hash: account.password
    })
    if (!comparerResult) {
      return left(new AuthenticationError())
    }
    const accessToken = await this.updateAccessToken.update(account.id)
    return right(accessToken)
  }
}
