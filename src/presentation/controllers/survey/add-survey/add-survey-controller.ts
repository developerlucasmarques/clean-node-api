import { Controller, HttpRequest, HttpResponse, Validation } from '.'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return await Promise.resolve({
      statusCode: 1,
      body: 'any_body'
    })
  }
}
