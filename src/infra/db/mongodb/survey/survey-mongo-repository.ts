import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { AddSurveyData } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyData): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.insertOne(surveyData)
  }
}
