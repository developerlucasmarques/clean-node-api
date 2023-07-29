export class InvalidAnswerError extends Error {
  constructor (message: string) {
    super(`The answer ${message}`)
    this.name = 'InvalidAnswerError'
  }
}
