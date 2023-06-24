import { AccountData, AccountModel, AddAccountRepository } from '.'
import { LoadAccountByEmailRepository, LoadAccountByEmailResponse } from '../../../../data/usecases/authentication'
import { right } from '../../../../shared/either'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AccountData): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.mapAddAccount(result, accountData)
  }

  async loadAccountByEmail (email: string): Promise<LoadAccountByEmailResponse> {
    const accountCollection = await MongoHelper.getCollection('account')
    const account = await accountCollection.findOne({ email })
    return right(MongoHelper.map(account))
  }
}
