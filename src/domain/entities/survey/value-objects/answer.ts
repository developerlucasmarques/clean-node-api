import { Either, left, right } from '../../../../shared/either'
import { InvalidAnswerError } from '../errors'

export class Answer {
  private constructor (private readonly answer: string) {
    Object.freeze(this)
  }

  static create (answer: string): Either<InvalidAnswerError, Answer> {
    const validate = Answer.validate(answer)
    if (validate) {
      return left(validate)
    }
    return right(new Answer(answer))
  }

  private static validate (answer: string): InvalidAnswerError | null {
    if (!answer) {
      return new InvalidAnswerError('not provided')
    }
    if (answer.length < 3) {
      return new InvalidAnswerError('contains less than 3 characters')
    }
    return null
  }
}
