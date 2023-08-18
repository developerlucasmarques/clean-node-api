import { LoadSurveys } from '../../../../domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { noContent, ok } from '../add-survey'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load()
    if (surveys.length === 0) return noContent()
    return ok(surveys)
  }
}
