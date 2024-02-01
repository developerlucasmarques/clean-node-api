import { SaveSurveyResult } from '@/domain/contracts'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/contracts'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { SaveSurveyResultDataController } from '@/presentation/types'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly validation: Validation<SaveSurveyResultDataController>,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(httpRequest.body)
      if (validationResult.isLeft()) {
        return badRequest(validationResult.value)
      }
      const { answer } = httpRequest.body
      const { surveyId } = httpRequest.params
      const { accountId } = httpRequest.headers
      const saveSurveyResult = await this.saveSurveyResult.save({
        answer, surveyId, accountId, date: new Date()
      })
      if (saveSurveyResult.isLeft()) {
        return badRequest(saveSurveyResult.value)
      }
      return ok(saveSurveyResult.value)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
