import { InvalidTokenError } from '@/domain/errors'
import { LoadAccountByToken } from '@/domain/usecases'
import { AccountRole } from '@/domain/models/account-role'
import { AccessTokenNotInformedError } from '../errors'
import { forbidden, ok, serverError, unauthorized } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: AccountRole
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) {
        return unauthorized(new AccessTokenNotInformedError())
      }
      const accountOrError = await this.loadAccountByToken.load({ accessToken, role: this.role })
      if (accountOrError.isLeft()) {
        if (accountOrError.value instanceof InvalidTokenError) {
          return unauthorized(accountOrError.value)
        }
        return forbidden(accountOrError.value)
      }
      return ok({ accountId: accountOrError.value.id })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
