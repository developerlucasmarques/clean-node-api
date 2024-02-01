import { SaveSurveyResult } from '@/domain/contracts'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { DbSaveSurveyResult } from '@/interactions/usecases/survey-result/save-survey-result'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyMongoRepository, surveyResultMongoRepository)
}
