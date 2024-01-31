import { LoadSurveys } from '@/domain/contracts'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/contracts'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'

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
