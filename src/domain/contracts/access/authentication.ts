import { Either } from '@/shared/either'
import { AuthenticationError } from '@/domain/errors/authentication-error'

export interface AuthenticationData {
  email: string
  password: string
}

export type AuthenticationResponse = Either<AuthenticationError, string>

export interface Authentication {
  auth: (authenticationData: AuthenticationData) => Promise<AuthenticationResponse>
}
