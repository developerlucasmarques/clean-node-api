export interface UpdateAccessToken {
  update: (accountId: string) => Promise<string>
}
