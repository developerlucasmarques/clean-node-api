export class LoadAccountByEmailError extends Error {
  constructor (email: string) {
    super(`Account with email '${email}' not found`)
    this.name = 'LoadAccountByEmailError'
  }
}
