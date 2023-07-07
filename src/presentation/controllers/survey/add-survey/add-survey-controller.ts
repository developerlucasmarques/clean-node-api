import { Controller, HttpRequest, HttpResponse, Validation, badRequest } from '.'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validationResult = this.validation.validate(httpRequest.body)
    if (validationResult.isLeft()) {
      return badRequest(validationResult.value)
    }
    return await Promise.resolve({
      statusCode: 1,
      body: 'any_body'
    })
  }
}
