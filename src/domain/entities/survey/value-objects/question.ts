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
      return new InvalidQuestionError('Question not provided')
    }
    if (question.length < 7) {
      return new InvalidQuestionError('Contains less than 7 characters')
    }
    return null
  }
}
