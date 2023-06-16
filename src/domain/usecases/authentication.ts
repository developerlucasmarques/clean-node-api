import { Either } from '../../shared/either'
import { AuthenticationError } from '../errors/authentication-error'

export interface LoginModel {
  email: string
  password: string
}

export interface Authentication {
  auth: (loginData: LoginModel) => Promise<Either<AuthenticationError, string>>
}
