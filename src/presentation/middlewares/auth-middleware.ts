import { InvalidTokenError } from '../../domain/errors'
import { LoadAccountByToken } from '../../domain/usecases'
import { AccessTokenNotInformedError } from '../errors'
import { ok, unauthorized } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (!accessToken) {
      return unauthorized(new AccessTokenNotInformedError())
    }
    const accountOrError = await this.loadAccountByToken.load(httpRequest.headers['x-access-token'])
    if (accountOrError.isLeft()) {
      if (accountOrError.value instanceof InvalidTokenError) {
        return unauthorized(accountOrError.value)
      }
    }
    return ok({
      id: '213123',
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  }
}
