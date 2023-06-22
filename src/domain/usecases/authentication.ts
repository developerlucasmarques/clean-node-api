import { Either } from '../../shared/either'
import { AuthenticationError } from '../errors/authentication-error'

export interface AuthenticationModel {
  email: string
  password: string
}

export type AuthenticationResponse = Either<AuthenticationError, string>
export interface Authentication {
  auth: (authenticationData: AuthenticationModel) => Promise<AuthenticationResponse>
}
