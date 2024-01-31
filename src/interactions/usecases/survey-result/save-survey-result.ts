import { SaveSurveyResult, SaveSurveyResultData, SaveSurveyResultResponse } from '@/domain/contracts'
import { InvalidSurveyError } from '@/domain/errors'
import { LoadSurveyByIdRepository } from '@/interactions/contracts/db/survey'
import { left } from '@/shared/either'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async save (data: SaveSurveyResultData): Promise<SaveSurveyResultResponse> {
    const survey = await this.loadSurveyByIdRepository.loadById(data.surveyId)
    if (!survey) {
      return left(new InvalidSurveyError(data.surveyId))
    }
    const value: any = ''
    return value
  }
}
