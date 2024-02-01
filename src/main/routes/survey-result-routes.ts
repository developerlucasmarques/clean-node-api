import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result-factory'
import { auth } from '../middlewares/auth'

export default async (router: Router): Promise<void> => {
  router.put('/survey/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
