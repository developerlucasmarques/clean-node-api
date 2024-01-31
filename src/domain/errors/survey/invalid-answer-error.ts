export class InvalidAnswerError extends Error {
  constructor (answer: string) {
    super(`The Answer '${answer}' is invalid`)
  }
}
