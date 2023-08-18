import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey.factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export default async (router: Router): Promise<void> => {
  router.post('/survey', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
