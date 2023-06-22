import { AccountModel } from '../../../domain/models/account'
import { Either } from '../../../shared/either'
import { LoadAccountByEmailError } from '../../errors/load-account-by-email-error'

export type LoadAccountByEmailResponse = Either<LoadAccountByEmailError, AccountModel>

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<LoadAccountByEmailResponse>
}
