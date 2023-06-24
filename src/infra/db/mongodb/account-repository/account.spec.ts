import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
import { LoadAccountByEmailError } from '../../../../data/errors/load-account-by-email-error'
import { AccountData } from '../../../../domain/usecases/add-account'

let accountCollection: Collection

const makeFakeAccountData = (): AccountData => ({
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'password1234'
})

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
    const account = await sut.add(makeFakeAccountData())
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('password1234')
  })

  test('Should return an account if loadAccountByEmail on success', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne(makeFakeAccountData())
    const accountEnteredWithId = MongoHelper.mapAddAccount(result, makeFakeAccountData())
    const account = await sut.loadAccountByEmail('any_email@mail.com')
    expect(account.value).toEqual(accountEnteredWithId)
  })

  test('Should return LoadAccountByEmailError if loadAccountByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadAccountByEmail('another_email@mail.com')
    expect(account.value).toEqual(new LoadAccountByEmailError('another_email@mail.com'))
  })

  test('Should update the account accessToken if updateAccessToken success', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne(makeFakeAccountData())
    const accountWithoutAccessToken = await accountCollection.findOne({ _id: result.insertedId })
    expect(accountWithoutAccessToken?.accessToken).toBeFalsy()
    await sut.updateAccessToken({
      accountId: result.insertedId.toHexString(),
      accessToken: 'any_token'
    })
    const account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account?.accessToken).toBe('any_token')
  })
})
