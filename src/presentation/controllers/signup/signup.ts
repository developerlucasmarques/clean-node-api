import { Controller, HttpResponse, HttpRequest, AddAccount, Validation } from '.'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const account = await this.addAccount.add({ name, email, password })
      if (account.isLeft()) {
        return badRequest(account.value)
      }
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
