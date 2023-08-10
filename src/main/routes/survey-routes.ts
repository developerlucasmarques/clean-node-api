import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey.factory'
import { makeAuthMiddleare } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express/express-middleware-adapter'

export default async (router: Router): Promise<void> => {
  const adminAuth = adaptMiddleware(makeAuthMiddleare('admin'))
  router.post('/survey', adminAuth, adaptRoute(makeAddSurveyController()))
}
