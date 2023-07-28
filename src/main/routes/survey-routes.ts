import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey.factory'

export default async (router: Router): Promise<void> => {
  router.post('/survey', adaptRoute(makeAddSurveyController()))
}
