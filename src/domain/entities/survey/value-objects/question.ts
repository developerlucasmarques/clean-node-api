import { Either, left, right } from '../../../../shared/either'
import { InvalidQuestionError } from '../errors'

export class Question {
  private constructor (private readonly question: string) {
    Object.freeze(this)
  }

  static create (question: string): Either<InvalidQuestionError, Question> {
    if (!Question.validate(question)) {
      return left(new InvalidQuestionError())
    }
    return right(new Question(question))
  }

  private static validate (question: string): boolean {
    return false
  }
}
