export interface UpdateAccessTokenData {
  accountId: string
  accessToken: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (values: UpdateAccessTokenData) => Promise<void>
}
