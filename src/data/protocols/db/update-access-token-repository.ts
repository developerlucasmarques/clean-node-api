export interface UpdateAccessTokenData {
  accountId: string
  accessTokent: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (values: UpdateAccessTokenData) => Promise<void>
}
