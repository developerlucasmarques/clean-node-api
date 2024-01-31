import { left, right } from '@/shared/either'
import { Account } from '@/domain/entities/account'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@/interactions/protocols/db/account'
import { AccountData, AddAccount, AddAccountResponse, UpdateAccessToken } from '@/domain/usecases'
import { EmailInUseError } from '@/domain/errors'
import { Hasher } from '@/interactions/protocols/criptography'
import { AccountRole } from '@/domain/models'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly updateAccessToken: UpdateAccessToken
  ) {}

  async add (accountData: AccountData): Promise<AddAccountResponse> {
    const accountOrError = Account.create(accountData)
    if (accountOrError.isLeft()) {
      return left(accountOrError.value)
    }
    const loadAccountResult = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (loadAccountResult) {
      return left(new EmailInUseError(accountData.email))
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    const role: AccountRole = 'user'
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword, role })
    )
    const accessToken = await this.updateAccessToken.update(account.id)
    return right(accessToken)
  }
}
