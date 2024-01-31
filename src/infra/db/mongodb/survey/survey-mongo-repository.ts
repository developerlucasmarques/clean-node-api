import { LoadSurveysRepository } from '@/interactions/protocols/db/survey'
import { AddSurveyRepository } from '@/interactions/protocols/db/survey/add-survey-repository'
import { SurveyModel } from '@/domain/models'
import { AddSurveyData } from '@/domain/contracts/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyData): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const surveys = await surveyCollection.find().toArray()
    const surveysWithFormattedId: any[] = surveys.map((survey) => (MongoHelper.map(survey)))
    return surveysWithFormattedId
  }
}
