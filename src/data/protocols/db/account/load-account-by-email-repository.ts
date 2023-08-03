import { AccountModel } from '../../../../domain/models/account'
import { Either } from '../../../../shared/either'
import { LoadAccountByEmailError } from '../../../errors'

export type LoadAccountByEmailResponse = Either<LoadAccountByEmailError, AccountModel>

export interface LoadAccountByEmailRepository {
  loadAccountByEmail: (email: string) => Promise<LoadAccountByEmailResponse>
}
