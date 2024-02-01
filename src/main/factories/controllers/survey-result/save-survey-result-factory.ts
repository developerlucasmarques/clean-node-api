import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/contracts'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result-controller'
import { makeDbSaveSurveyResult } from '../../usecases/survey-result/db-save-survey-result-factory'
import { makeSaveSurveyResultValidation } from './save-survey-result-validation-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeSaveSurveyResultValidation(),
    makeDbSaveSurveyResult()
  )
  return makeLogControllerDecorator(controller)
}
