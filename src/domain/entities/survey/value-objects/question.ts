import { Either, left, right } from '../../../../shared/either'
import { InvalidQuestionError } from '../errors'

export class Question {
  private constructor (private readonly question: string) {
    Object.freeze(this)
  }

  static create (question: string): Either<InvalidQuestionError, Question> {
    const validate = Question.validate(question)
    if (validate) {
      return left(validate)
    }
    return right(new Question(question))
  }

  private static validate (question: string): InvalidQuestionError | null {
    if (!question) {
      return new InvalidQuestionError('not provided')
    }
    if (question.length < 7) {
      return new InvalidQuestionError('contains less than 7 characters')
    }
    if (question.length > 300) {
      return new InvalidQuestionError('contains more than 300 characters')
    }
    return null
  }
}
