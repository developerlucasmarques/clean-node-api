export class InvalidSurveyError extends Error {
  constructor (surveyId: string) {
    super(`The Survey with ID '${surveyId}' is invalid`)
  }
}
