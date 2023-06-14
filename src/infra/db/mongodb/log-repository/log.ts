import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stackError: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('error')
    await errorCollection.insertOne({
      stack: stackError,
      date: new Date()
    })
  }
}
