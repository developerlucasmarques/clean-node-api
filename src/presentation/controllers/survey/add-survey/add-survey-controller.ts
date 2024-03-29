import { AddSurvey } from '@/domain/contracts'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/contracts'
import { AddSurveyDataController } from '@/presentation/types'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation<AddSurveyDataController>,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(httpRequest.body)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const { question, answers } = httpRequest.body
      const addSurveyResult = await this.addSurvey.add({ question, answers, date: new Date() })
      if (addSurveyResult.isLeft()) {
        return badRequest(addSurveyResult.value)
      }
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
