import { Authentication, AuthenticationData } from '@/domain/contracts'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/contracts'

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation<AuthenticationData>,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = this.validation.validate(httpRequest.body)
      if (result.isLeft()) {
        return badRequest(result.value)
      }
      const accessToken = await this.authentication.auth(httpRequest.body)
      if (accessToken.isLeft()) {
        return unauthorized(accessToken.value)
      }
      return ok({ accessToken: accessToken.value })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
