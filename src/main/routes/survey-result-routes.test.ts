import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT /survey/:surveyId/results', () => {
    test('Shound return 401 on save survey result without access token', async () => {
      await request(app)
        .put('/api/survey/any_survey_id/results')
        .send({ answer: 'any_answer' })
        .expect(401)
    })
  })
})
