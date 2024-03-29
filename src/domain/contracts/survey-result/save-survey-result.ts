import { Either } from '@/shared/either'
import { InvalidAnswerError, InvalidSurveyError } from '@/domain/errors'
import { SurveyResultModel } from '@/domain/models'

export type SaveSurveyResultData = Omit<SurveyResultModel, 'id'>

export type SaveSurveyResultResponse = Either<InvalidSurveyError | InvalidAnswerError, SurveyResultModel>

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultData) => Promise<SaveSurveyResultResponse>
}
