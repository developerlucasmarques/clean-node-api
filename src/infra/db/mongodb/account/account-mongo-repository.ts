import { LoadAccountByEmailError } from '../../../../data/errors'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository, AddAccountRepository, LoadAccountByEmailResponse, UpdateAccessTokenData } from '../../../../data/protocols/db/account'
import { AccountModel } from '../../../../domain/models'
import { AccountData } from '../../../../domain/usecases'
import { left, right } from '../../../../shared/either'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AccountData): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.mapAddAccount(result, accountData)
  }

  async loadAccountByEmail (email: string): Promise<LoadAccountByEmailResponse> {
    const accountCollection = await MongoHelper.getCollection('account')
    const account = await accountCollection.findOne({ email })
    if (!account) {
      return left(new LoadAccountByEmailError(email))
    }
    return right(MongoHelper.map(account))
  }

  async updateAccessToken (values: UpdateAccessTokenData): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('account')
    const mongoId = MongoHelper.transformIdInObjectId(values.accountId)
    await accountCollection.updateOne({ _id: mongoId }, { $set: { accessToken: values.accessToken } })
  }
}
