import { DbLoadSurveys } from '@/interactions/usecases/survey/load-surveys/db-load-surveys'
import { LoadSurveys } from '@/domain/contracts'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const loadSurveysRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(loadSurveysRepository)
}
