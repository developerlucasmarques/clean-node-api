import { Answer, Image } from '.'
import { Either, left, right } from '../../../../shared/either'
import { InvalidAnswerError, InvalidImageError } from '../errors'

export interface SurveyAnswerModel {
  image?: Image
  answer: Answer
}

export interface SurveyAnswerData {
  image?: string
  answer: string
}

export class SurveyAnswer {
  private constructor (private readonly input: SurveyAnswerModel) {
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
    const answer = Answer.create(input.answer)
    if (answer.isLeft()) {
      return left(answer.value)
    }
    return right(new SurveyAnswer({ answer: answer.value, image }))
  }
}
