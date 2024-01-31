import { AddSurveyData } from '@/domain/contracts/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyData) => Promise<void>
}
