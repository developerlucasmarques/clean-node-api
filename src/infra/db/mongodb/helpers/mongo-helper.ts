import { MongoClient, Collection, InsertOneResult } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (url: string | undefined): Promise<void> {
    if (!url) {
      url = 'mongodb://127.0.0.1:27017/clean-node-api'
    }
    this.client = await MongoClient.connect(url)
    console.log(`MongoDB running at ${url}`)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  },

  map (result: InsertOneResult<Document>, data: any): any {
    return {
      id: result.insertedId.toHexString(),
      ...data
    }
  }
}
