import { SaveSurveyResultData } from '@/domain/contracts'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultRepository } from '@/interactions/contracts/db'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultData): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResult')
    const { accountId, answer, date, surveyId } = data
    const surveyResult = await surveyResultCollection.findOneAndUpdate(
      { surveyId, accountId },
      { $set: { answer, date } },
      { upsert: true, returnDocument: 'after' }
    )
    return MongoHelper.map(surveyResult.value)
  }
}
