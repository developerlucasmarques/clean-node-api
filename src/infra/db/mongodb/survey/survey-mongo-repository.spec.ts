import { Collection, ObjectId } from 'mongodb'
import { AddSurveyData } from '@/domain/contracts'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import MockDate from 'mockdate'

let surveyCollection: Collection

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

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
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
    surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeSurveyData())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const sut = makeSut()
      await surveyCollection.insertMany([{
        ...makeFakeSurveyData()
      }, {
        question: 'other_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }])
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load an survey on success', async () => {
      const sut = makeSut()
      const surveyResult = await surveyCollection.insertOne(makeFakeSurveyData())
      const id = surveyResult.insertedId.toHexString()
      const survey = await sut.loadById(id)
      expect(survey).toEqual({ id, ...makeFakeSurveyData() })
    })

    test('Should return null if survey not found', async () => {
      const sut = makeSut()
      const id = new ObjectId().toHexString()
      const survey = await sut.loadById(id)
      expect(survey).toBe(null)
    })
  })
})
