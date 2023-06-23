export interface UpdateAccessTokenData {
  accountId: string
  accessTokent: string
}

export interface UpdateAccessTokenRepository {
  update: (values: UpdateAccessTokenData) => Promise<void>
}
