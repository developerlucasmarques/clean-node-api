export class InvalidQuestionError extends Error {
  constructor () {
    super('The question is invalid')
    this.name = 'InvalidQuestionError'
  }
}
