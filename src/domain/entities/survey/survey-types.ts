import { Either } from '@/shared/either'
import { InvalidAnswerError, InvalidAnswersError, InvalidImageError, InvalidQuestionError } from './errors'
import { Survey } from './survey'

interface SurveyAnswerData {
  image?: string
  answer: string
}

export interface SurveyData {
  question: string
  answers: SurveyAnswerData[]
  date: Date
}

type SurveyErrors = InvalidQuestionError | InvalidAnswerError | InvalidAnswersError | InvalidImageError

export type SurveyResponse = Either<SurveyErrors, Survey>
