import { AddSurveyData, SaveSurveyResultData } from '@/domain/contracts'
import MockDate from 'mockdate'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { AccountModel, SurveyModel } from '@/domain/models'
import { AccountDataRepository } from '@/interactions/contracts/db'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeFakeSurveyData = (): AddSurveyData => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeAccountData = (): AccountDataRepository => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  role: 'user'
})

const makeFakeSaveSurveyResultData = (accountId: string, surveyId: string): SaveSurveyResultData => ({
  accountId,
  surveyId,
  answer: 'any_answer',
  date: new Date()
})

const makeSurvey = async (): Promise<SurveyModel> => {
  const survey = await surveyCollection.insertOne(makeFakeSurveyData())
  return MongoHelper.mapAddAccount(survey, makeFakeSurveyData()) as unknown as SurveyModel
}

const makeAccount = async (): Promise<AccountModel> => {
  const account = await accountCollection.insertOne(makeFakeAccountData())
  return MongoHelper.mapAddAccount(account, makeFakeAccountData())
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('SurveyResult Mongo Repository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    surveyResultCollection = await MongoHelper.getCollection('surveyResult')
    accountCollection = await MongoHelper.getCollection('account')
    await surveyCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      const surveyResult = await sut.save(makeFakeSaveSurveyResultData(survey.id, account.id))
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    test('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      const res = await surveyResultCollection.insertOne(
        makeFakeSaveSurveyResultData(survey.id, account.id)
      )
      const data = makeFakeSaveSurveyResultData(survey.id, account.id)
      data.answer = 'new_answer'
      const surveyResult = await sut.save(data)
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe('new_answer')
      expect(res.insertedId.toHexString()).toBe(surveyResult.id)
    })
  })
})
