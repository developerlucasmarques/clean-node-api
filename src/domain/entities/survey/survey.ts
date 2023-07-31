import { Either, left, right } from '../../../shared/either'
import { InvalidQuestionError } from './errors'
import { Question } from './value-objects'

interface SurveyData {
  question: string
}

export class Survey {
  private constructor (private readonly question: Question) {
    Object.freeze(this)
  }

  static create (input: SurveyData): Either<InvalidQuestionError, Survey> {
    const questionResult = Question.create(input.question)
    // if (questionResult.isLeft()) {
    //   return left(questionResult.value)
    // }
    return right(new Survey(questionResult.value))
  }
}
