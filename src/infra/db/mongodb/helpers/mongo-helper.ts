import { MongoClient, Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  },

  map (collection: any): AccountModel {
    const { _id, ...collectionWithoutId } = collection
    const account = Object.assign({}, collectionWithoutId, { id: _id.toHexString() })
    return account
  }
}
