import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

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
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
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

    test('Shound return 204 on add survey with valid accessToken', async () => {
      const accountData = {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'password1234',
        role: 'admin'
      }
      const result = await accountCollection.insertOne(accountData)
      const account = MongoHelper.mapAddAccount(result, accountData)
      const accessToken = sign(account.id, env.jwtSecretKey)
      await accountCollection.updateOne({ _id: result.insertedId }, { $set: { accessToken } })

      await request(app)
        .post('/api/survey')
        .set('x-access-token', accessToken)
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
        .expect(204)
    })
  })

  describe('Get /surveys', () => {
    test('Should return 401 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(401)
    })
  })
})
