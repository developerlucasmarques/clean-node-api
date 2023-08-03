import { AccessDeniedError } from '../errors'
import { unauthorized } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return unauthorized(new AccessDeniedError())
  }
}
