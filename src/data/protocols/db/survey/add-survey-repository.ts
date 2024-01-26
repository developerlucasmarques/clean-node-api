import { AddSurveyData } from '@/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyData) => Promise<void>
}
