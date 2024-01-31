import { Either } from '@/shared/either'
import { InvalidAnswerError, InvalidImageError, InvalidQuestionError } from '../../entities/survey/errors'

export interface SurveyAnswer {
  image?: string
  answer: string
}

export interface AddSurveyData {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export type AddSurveyResponse = Either<InvalidQuestionError | InvalidAnswerError | InvalidImageError, null>

export interface AddSurvey {
  add: (data: AddSurveyData) => Promise<AddSurveyResponse>
}
