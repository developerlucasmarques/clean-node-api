import { Either, left, right } from '../../../shared/either'
import { InvalidQuestionError } from './errors'
import { Question, SurveyAnswer } from './value-objects'

interface SurveyAnswerData {
  image?: string
  answer: string
}

export interface SurveyData {
  question: string
  answers: SurveyAnswerData[]
}

export class Survey {
  private constructor (
    private readonly question: Question,
    private readonly answers: SurveyAnswer[]
  ) {
    Object.freeze(this)
  }

  static create (input: SurveyData): Either<InvalidQuestionError, Survey> {
    const questionResult = Question.create(input.question)
    if (questionResult.isLeft()) {
      return left(questionResult.value)
    }
    const answers: SurveyAnswer[] = []
    for (const answer of input.answers) {
      const surveyAnswerResult = SurveyAnswer.create(answer)
      if (surveyAnswerResult.isLeft()) {
        return left(surveyAnswerResult.value)
      }
      answers.push(surveyAnswerResult.value)
    }
    return right(new Survey(questionResult.value, answers))
  }
}
