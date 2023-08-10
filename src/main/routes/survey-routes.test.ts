import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  describe('POST /survey', () => {
    test('Shound return 401 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/survey')
        .send({
          question: 'any_question',
          answers: [{
            image: 'http://image-name.com',
            answer: 'any_answer'
          },
          {
            answer: 'other_answer'
          }]
        })
        .expect(401)
    })
  })
})
