import { SurveyModel } from '../../../../domain/models'
import { LoadSurveys } from '../../../../domain/usecases'
import { LoadSurveysRepository } from '../../../protocols/db/survey'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll()
    return [{
      id: 'other_id',
      question: 'any_question',
      answers: [{
        image: 'any_url_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }]
  }
}
