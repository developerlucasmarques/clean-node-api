import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/contracts'
import { badRequest } from '@/presentation/helpers/http-helper'
import { SaveSurveyResultDataController } from '@/presentation/types'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly validation: Validation<SaveSurveyResultDataController>) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validationResult = this.validation.validate(httpRequest.body)
    if (validationResult.isLeft()) {
      return badRequest(validationResult.value)
    }
    return { statusCode: 9, body: '' }
  }
}