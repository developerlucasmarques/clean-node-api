import { AccountDataRepository, AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenData, UpdateAccessTokenRepository } from '../../../../data/protocols/db/account'
import { AccountModel } from '../../../../domain/models'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AccountDataRepository): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.mapAddAccount(result, accountData)
  }

  async loadByEmail (email: string): Promise<null | AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const account = await accountCollection.findOne({ email })
    return MongoHelper.map(account)
  }

  async updateAccessToken (values: UpdateAccessTokenData): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('account')
    const mongoId = MongoHelper.transformIdInObjectId(values.accountId)
    await accountCollection.updateOne({ _id: mongoId }, { $set: { accessToken: values.accessToken } })
  }

  async loadByToken (accessToken: string): Promise< null | AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const account = await accountCollection.findOne({ accessToken })
    return MongoHelper.map(account)
  }
}
