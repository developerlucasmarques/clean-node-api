import { left, right } from '../../../shared/either'
import { Account } from '../../../domain/entities/account'
import { Hasher, AddAccountRepository, AccountData, AddAccount, AddAccountResponse } from '.'
import { LoadAccountByEmailRepository, UpdateAccessToken } from '../authentication'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly updateAccessToken: UpdateAccessToken,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AccountData): Promise<AddAccountResponse> {
    const accountOrError = Account.create(accountData)
    if (accountOrError.isLeft()) {
      return left(accountOrError.value)
    }
    await this.loadAccountByEmailRepository.loadAccountByEmail(accountData.email)
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    const accessToken = await this.updateAccessToken.update(account.id)
    return right(accessToken)
  }
}
