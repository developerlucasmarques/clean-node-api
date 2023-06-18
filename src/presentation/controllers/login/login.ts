import { Authentication, EmailValidator, Controller, HttpRequest, HttpResponse } from '.'
import { InvalidEmailError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidEmailError(email))
      }
      const accessToken = await this.authentication.auth({ email, password })
      if (accessToken.isLeft()) {
        return unauthorized(accessToken.value)
      }
      return ok({ accessToken: accessToken.value })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
