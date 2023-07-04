import { AddAccount, Authentication, Controller, HttpRequest, HttpResponse, Validation } from '.'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validation = this.validation.validate(httpRequest.body)
      if (validation.isLeft()) {
        return badRequest(validation.value)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })
      if (account.isLeft()) {
        return badRequest(account.value)
      }
      await this.authentication.auth({ email, password })
      return ok({
        id: account.value.id,
        name: account.value.name,
        email: account.value.email
      })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
