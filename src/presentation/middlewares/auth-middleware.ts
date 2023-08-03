import { InvalidTokenError } from '../../domain/errors'
import { LoadAccountByToken } from '../../domain/usecases'
import { AccessTokenNotInformedError } from '../errors'
import { forbidden, ok, serverError, unauthorized } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) {
        return unauthorized(new AccessTokenNotInformedError())
      }
      const accountOrError = await this.loadAccountByToken.load(httpRequest.headers['x-access-token'])
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
