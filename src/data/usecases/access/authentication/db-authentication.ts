import { Authentication, AuthenticationData, AuthenticationResponse, UpdateAccessToken } from '@/domain/usecases'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account'
import { HashComparer } from '@/data/protocols/criptography'
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
