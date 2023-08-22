export class InvalidAnswersError extends Error {
  constructor (message: string) {
    super(`The answers ${message}`)
    this.name = 'InvalidAnswersError'
  }
}
