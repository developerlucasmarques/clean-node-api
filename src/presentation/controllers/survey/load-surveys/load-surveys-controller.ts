import { LoadSurveys } from '../../../../domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      if (surveys.length === 0) return noContent()
      return ok(surveys)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
