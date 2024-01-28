import { left, right } from '@/shared/either'
import { InvalidAnswersError } from './errors'
import { SurveyData, SurveyResponse } from './survey-types'
import { Question, SurveyAnswer } from './value-objects'

export class Survey {
  private constructor (
    private readonly question: Question,
    private readonly answers: SurveyAnswer[],
    private readonly date: Date
  ) {
    Object.freeze(this)
  }

  static create (input: SurveyData): SurveyResponse {
    if (input.answers.length === 0) {
      return left(new InvalidAnswersError('cannot be empty'))
    }
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
    return right(new Survey(questionResult.value, answers, input.date))
  }
}
