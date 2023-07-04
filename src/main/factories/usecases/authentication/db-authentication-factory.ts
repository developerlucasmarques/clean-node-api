import { DbAuthentication } from '../../../../data/usecases/authentication'
import { Authentication } from '../../../../domain/usecases/authentication'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { makeDbUpdateAccessToken } from '../../usecases/update-access-token/db-update-access-token-factory'

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
