import { Either, left, right } from '@/shared/either'
import { InvalidAnswerError } from '../../errors'

export class Answer {
  private constructor (private readonly answer: string) {
    Object.freeze(this)
  }

  static create (answer: string): Either<InvalidAnswerError, Answer> {
    const validate = Answer.validate(answer)
    if (validate) {
      return left(validate)
    }
    answer = answer.trim()
    return right(new Answer(answer))
  }

  private static validate (answer: string): InvalidAnswerError | null {
    if (!answer) {
      return new InvalidAnswerError('not provided')
    }
    answer = answer.trim()
    if (answer.length < 3) {
      return new InvalidAnswerError('contains less than 3 characters')
    }
    if (answer.length > 300) {
      return new InvalidAnswerError('contains more than 300 characters')
    }
    return null
  }
}
