import { left, right } from '../../../shared/either'
import { Account } from '../../../domain/entities/account'
import { Hasher, AddAccountRepository, AccountData, AddAccount, AddAccountResponse } from '.'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AccountData): Promise<AddAccountResponse> {
    const accountOrError = Account.create(accountData)
    if (accountOrError.isLeft()) {
      return left(accountOrError.value)
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return right(account)
  }
}
