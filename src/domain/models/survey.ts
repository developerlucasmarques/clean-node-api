export interface SurveyAnswerData {
  image?: string
  answer: string
}

export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerData[]
  date: Date
}
