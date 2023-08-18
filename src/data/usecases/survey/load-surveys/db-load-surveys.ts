import { SurveyModel } from '../../../../domain/models'
import { LoadSurveys } from '../../../../domain/usecases'
import { LoadSurveysRepository } from '../../../protocols/db/survey'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll()
    return surveys
  }
}
