import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import { AccountModel } from '@/domain/models'
import { AddSurveyData } from '@/domain/contracts'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const accountData = {
    name: 'any name',
    email: 'any_email@mail.com',
    password: 'password1234',
    role: 'admin'
  }
  const result = await accountCollection.insertOne(accountData)
  const account = MongoHelper.mapAdd<AccountModel>(result, accountData)
  const accessToken = sign(account.id, env.jwtSecretKey)
  await accountCollection.updateOne({ _id: result.insertedId }, { $set: { accessToken } })
  return accessToken
}

const makeFakeSurveyData = (): AddSurveyData => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }],
  date: new Date()
})

describe('SurveyResult Routes', () => {
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

  describe('PUT /survey/:surveyId/results', () => {
    test('Shound return 401 on save survey result without access token', async () => {
      await request(app)
        .put('/api/survey/any_survey_id/result')
        .send({ answer: 'any_answer' })
        .expect(401)
    })
  })

  test('Shound return 200 on save survey result with valid accessToken', async () => {
    const res = await surveyCollection.insertOne(makeFakeSurveyData())
    const surveyId = res.insertedId.toHexString()
    const accessToken = await makeAccessToken()
    await request(app)
      .put(`/api/survey/${surveyId}/result`)
      .set('x-access-token', accessToken)
      .send({ answer: 'any_answer' })
      .expect(200)
  })
})
