import { SaveSurveyResultData } from '@/domain/contracts'
import { SurveyResultModel } from '@/domain/models'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultData) => Promise<SurveyResultModel>
}
