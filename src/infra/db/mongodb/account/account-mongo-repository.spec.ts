import { Collection } from 'mongodb'
import { AccountDataRepository } from '@/interactions/contracts/db/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

const makeFakeAccountData = (): AccountDataRepository => ({
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'password1234',
  role: 'admin'
})

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

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

  describe('add()', () => {
    test('Should return an account if add on success', async () => {
      const sut = makeSut()
      const account = await sut.add(makeFakeAccountData())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('password1234')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account if loadByEmail on success', async () => {
      const sut = makeSut()
      const result = await accountCollection.insertOne(makeFakeAccountData())
      const accountEnteredWithId = MongoHelper.mapAddAccount(
        result,
        makeFakeAccountData()
      )
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toEqual(accountEnteredWithId)
    })

    test('Should return LoadAccountByEmailError if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('another_email@mail.com')
      expect(account).toBeNull()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken if updateAccessToken success', async () => {
      const sut = makeSut()
      const result = await accountCollection.insertOne(makeFakeAccountData())
      const accountWithoutAccessToken = await accountCollection.findOne({
        _id: result.insertedId
      })
      expect(accountWithoutAccessToken?.accessToken).toBeFalsy()
      await sut.updateAccessToken({
        accountId: result.insertedId.toHexString(),
        accessToken: 'any_token'
      })
      const account = await accountCollection.findOne({
        _id: result.insertedId
      })
      expect(account?.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken', async () => {
      const sut = makeSut()
      const accountData = {
        ...makeFakeAccountData(),
        accessToken: 'any_token'
      }
      const result = await accountCollection.insertOne(accountData)
      const accountEnteredWithId = MongoHelper.mapAddAccount(
        result,
        accountData
      )
      const account = await sut.loadByToken('any_token')
      expect(account).toEqual(accountEnteredWithId)
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeNull()
    })
  })
})
