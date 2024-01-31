import { Either } from '@/shared/either'
import { AuthenticationError } from '../errors/authentication-error'

export interface AuthenticationData {
  email: string
  password: string
}

export type AuthenticationResponse = Either<AuthenticationError, string>

export interface Authentication {
  auth: (authenticationData: AuthenticationData) => Promise<AuthenticationResponse>
}
