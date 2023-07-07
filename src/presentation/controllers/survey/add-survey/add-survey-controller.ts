import { AddSurvey, Controller, HttpRequest, HttpResponse, Validation, badRequest, serverError } from '.'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(httpRequest.body)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({ question, answers })
      return await Promise.resolve({
        statusCode: 1,
        body: 'any_body'
      })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
