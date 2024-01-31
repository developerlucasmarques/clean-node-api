import { Either } from '@/shared/either'
import { InvalidAnswerError, InvalidSurveyError } from '../errors'
import { SurveyResultModel } from '../models'

export type SaveSurveyResultData = Omit<SurveyResultModel, 'id'>

export type SaveSurveyResultResponse = Either<InvalidSurveyError | InvalidAnswerError, SurveyResultModel>

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultData) => Promise<SaveSurveyResultResponse>
}
