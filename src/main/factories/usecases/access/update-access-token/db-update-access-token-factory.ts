import { DbUpdateAccessToken } from '@/data/usecases/access/update-access-token'
import { UpdateAccessToken } from '@/domain/usecases/update-access-token'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import env from '@/main/config/env'

export const makeDbUpdateAccessToken = (): UpdateAccessToken => {
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecretKey)
  return new DbUpdateAccessToken(jwtAdapter, accountMongoRepository)
}
