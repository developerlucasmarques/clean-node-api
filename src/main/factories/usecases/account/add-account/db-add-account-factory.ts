import { DbAddAccount } from '@/interactions/usecases/account/add-account/db-add-account'
import { AddAccount } from '@/domain/usecases/add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { makeDbUpdateAccessToken } from '../../access/update-access-token/db-update-access-token-factory'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(
    accountMongoRepository,
    bcryptAdapter,
    accountMongoRepository,
    makeDbUpdateAccessToken()
  )
}
