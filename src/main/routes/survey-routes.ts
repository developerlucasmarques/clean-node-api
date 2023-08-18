import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey.factory'
import { makeAuthMiddleare } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express/express-middleware-adapter'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-factory'

export default async (router: Router): Promise<void> => {
  const adminAuth = adaptMiddleware(makeAuthMiddleare('admin'))
  const auth = adaptMiddleware(makeAuthMiddleare('user'))

  router.post('/survey', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
