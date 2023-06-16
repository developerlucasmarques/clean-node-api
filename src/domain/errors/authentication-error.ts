export class AuthenticationError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'AuthenticationError'
  }
}
