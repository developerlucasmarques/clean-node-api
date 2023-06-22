import { Authentication, AuthenticationData, AuthenticationResponse } from '../../../domain/usecases/authentication'
import { right } from '../../../shared/either'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async auth (authenticationData: AuthenticationData): Promise<AuthenticationResponse> {
    this.loadAccountByEmailRepository.load(authenticationData.email)
    return await Promise.resolve(right('access_token'))
  }
}
