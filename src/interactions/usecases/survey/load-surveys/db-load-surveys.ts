import { SurveyModel } from '@/domain/models'
import { LoadSurveys } from '@/domain/contracts'
import { LoadSurveysRepository } from '@/interactions/contracts/db/survey'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll()
    return surveys
  }
}
