import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/contracts'
import { SaveSurveyResultDataController } from '@/presentation/types'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly validation: Validation<SaveSurveyResultDataController>) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return { statusCode: 9, body: '' }
  }
}
