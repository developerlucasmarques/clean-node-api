import { LoadSurveyById } from '@/domain/contracts'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyByIdRepository } from '@/interactions/contracts/db'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<SurveyModel | null> {
    return await this.loadSurveyByIdRepository.loadById(id)
  }
}
