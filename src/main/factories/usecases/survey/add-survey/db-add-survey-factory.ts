import { DbAddSurvey } from '@/interactions/usecases/survey/add-survey/db-add-survey'
import { AddSurvey } from '@/domain/contracts/survey/add-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
