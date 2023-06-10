import { MongoHelper as sut } from './mongo-helper'
import { MongoClient } from 'mongodb'

describe('Mongo Helper', () => {
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
