import { MongoClient, Collection, InsertOneResult, ObjectId } from 'mongodb'
import { AccountModel } from '../account'

export const MongoHelper = {
  client: null as unknown as MongoClient | null,
  uri: null as unknown as string,

  async connect (uri: string | undefined): Promise<void> {
    if (!uri) {
      this.uri = 'mongodb://127.0.0.1:27017/clean-node-api'
    } else {
      this.uri = uri
    }
    this.client = await MongoClient.connect(this.uri)
    console.log(`MongoDB running at ${this.uri}`)
  },

  async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.db) {
      this.client = await MongoClient.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  mapAddAccount (result: InsertOneResult<Document>, data: any): AccountModel {
    if (data._id) {
      delete data._id
    }
    return Object.assign({}, data, { id: result.insertedId.toHexString() })
  },

  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id.toHexString() })
  },

  transformIdInObjectId (id: string): ObjectId {
    return new ObjectId(id)
  }
}
