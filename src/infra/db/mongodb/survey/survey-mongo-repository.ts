import { LoadSurveysRepository, AddSurveyRepository, LoadSurveyByIdRepository } from '@/interactions/contracts/db'
import { SurveyModel } from '@/domain/models'
import { AddSurveyData } from '@/domain/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyData): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const surveys = await surveyCollection.find().toArray()
    const surveysWithFormattedId: any[] = surveys.map((survey) =>
      MongoHelper.map(survey)
    )
    return surveysWithFormattedId
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const _id = MongoHelper.transformIdInObjectId(id)
    const survey = await surveyCollection.findOne({ _id })
    const surveyWithFormattedId = MongoHelper.map(survey)
    return surveyWithFormattedId
  }
}
