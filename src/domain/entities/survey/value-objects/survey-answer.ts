import { Answer, Image } from '.'
import { Either, left, right } from '../../../../shared/either'
import { InvalidAnswerError, InvalidImageError } from '../errors'

export interface SurveyAnswerData {
  image?: string
  answer: string
}

export class SurveyAnswer {
  private constructor (
    private readonly answer: Answer,
    private readonly image: Image | undefined
  ) {
    Object.freeze(this)
  }

  static create (input: SurveyAnswerData): Either<InvalidImageError | InvalidAnswerError, SurveyAnswer> {
    let image: Image | undefined
    if (input.image) {
      const imageResult = Image.create(input.image)
      if (imageResult.isLeft()) {
        return left(imageResult.value)
      }
      image = imageResult.value
    }
    const answerResult = Answer.create(input.answer)
    if (answerResult.isLeft()) {
      return left(answerResult.value)
    }
    const answer = answerResult.value
    return right(new SurveyAnswer(answer, image))
  }
}
