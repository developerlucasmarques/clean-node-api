import { MongoHelper as sut } from './mongo-helper'
import { MongoClient } from 'mongodb'

describe('Mongo Helper', () => {
  test('Should reconnect if MongoDB is down', async () => {
    await sut.connect(process.env.MONGO_URL)

    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()

    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    sut.disconnect()
  })

  test('Should return AccountModel', async () => {
    const accountCollection = await sut.getCollection('account')
    const result = await accountCollection.insertOne({
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'password1234'
    })
    const { insertedId: id } = result
    const account = sut.map(await accountCollection.findOne({ _id: id }))
    expect(account).toEqual({
      id: id.toHexString(),
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'password1234'
    })
    sut.disconnect()
  })

  test('Should connect to the specified URL', async () => {
    const url = 'mongodb://127.0.0.1:27017/db-test'
    const mongoClientMock = {
      connect: jest.fn().mockResolvedValue(true)
    }
    MongoClient.connect = jest.fn().mockResolvedValue(mongoClientMock)
    sut.connect(url)
    expect(MongoClient.connect).toHaveBeenCalledWith(url)
  })

  test('Should connect to the default URL if no URL provided', async () => {
    const defaultUrl = 'mongodb://127.0.0.1:27017/clean-node-api'
    const mongoClientMock = {
      connect: jest.fn().mockResolvedValue(true)
    }
    MongoClient.connect = jest.fn().mockResolvedValue(mongoClientMock)
    sut.connect(undefined)
    expect(MongoClient.connect).toHaveBeenCalledWith(defaultUrl)
  })
})
