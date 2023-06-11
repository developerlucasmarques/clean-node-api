import { MongoClient, Collection, InsertOneResult } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient | null,

  async connect (url: string | undefined): Promise<void> {
    if (!url) {
      url = 'mongodb://127.0.0.1:27017/clean-node-api'
    }
    this.client = await MongoClient.connect(url)
    console.log(`MongoDB running at ${url}`)
  },

  async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      this.client = await MongoClient.connect(process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/clean-node-api')
    }
    return this.client.db().collection(name)
  },

  map (result: InsertOneResult<Document>, data: any): any {
    if (data._id) {
      delete data._id
    }
    return Object.assign({}, data, { id: result.insertedId.toHexString() })
  }
}
