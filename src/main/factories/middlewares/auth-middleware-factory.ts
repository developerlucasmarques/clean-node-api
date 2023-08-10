import { AccountRole } from '../../../domain/models'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { Middleware } from '../../../presentation/protocols'
import { makeDbLoadAccountByToken } from '../usecases/account/load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMiddleare = (role?: AccountRole): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
