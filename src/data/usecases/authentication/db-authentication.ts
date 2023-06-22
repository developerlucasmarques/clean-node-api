import { AuthenticationError } from '../../../domain/errors/authentication-error'
import { Authentication, AuthenticationData, AuthenticationResponse } from '../../../domain/usecases/authentication'
import { left, right } from '../../../shared/either'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async auth (authenticationData: AuthenticationData): Promise<AuthenticationResponse> {
    const accountOrError = await this.loadAccountByEmailRepository.load(authenticationData.email)
    if (accountOrError.isLeft()) {
      return left(new AuthenticationError())
    }
    return right('access_token')
  }
}
