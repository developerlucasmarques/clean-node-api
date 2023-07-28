export interface SurveyAnswer {
  image?: string
  answer: string
}

export interface AddSurveyData {
  question: string
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add: (data: AddSurveyData) => Promise<void>
}
