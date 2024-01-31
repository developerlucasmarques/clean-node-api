import { DbAuthentication } from '@/interactions/usecases/access/authentication'
import { Authentication } from '@/domain/contracts/authentication'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { makeDbUpdateAccessToken } from '../update-access-token/db-update-access-token-factory'

export const makeDbAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    makeDbUpdateAccessToken()
  )
}
