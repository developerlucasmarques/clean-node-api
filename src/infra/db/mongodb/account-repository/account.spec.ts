import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('account')
    accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account if add on success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'password1234'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('password1234')
  })

  test('Should return an account if loadAccountByEmail on success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'password1234'
    })

    const account = await sut.loadAccountByEmail('any_email@mail.com')
    if (account.isLeft()) {
      return
    }
    expect(account).toBeTruthy()
    expect(account.value.id).toBeTruthy()
    expect(account.value.name).toBe('any name')
    expect(account.value.email).toBe('any_email@mail.com')
    expect(account.value.password).toBe('password1234')
  })
})
