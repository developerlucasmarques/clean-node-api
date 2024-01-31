import { AddSurveyData } from '@/domain/contracts/survey/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyData) => Promise<void>
}
