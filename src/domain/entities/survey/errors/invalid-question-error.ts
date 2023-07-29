export class InvalidQuestionError extends Error {
  constructor (message: string) {
    super(`The question ${message}`)
    this.name = 'InvalidQuestionError'
  }
}
