import { SurveyAnswer, Image, Answer } from '.'
import { left } from '../../../../shared/either'
import { InvalidAnswerError, InvalidImageError } from '../errors'

const image = 'http://invalid-image.com'
const answer = 'any_answer'

describe('SurveyAnswer ValueObject', () => {
  test('Should return InvalidImageError if image is invalid', () => {
    jest.spyOn(Image, 'create').mockReturnValueOnce(
      left(new InvalidImageError('any error'))
    )

    const sut = SurveyAnswer.create({ image, answer })

    expect(sut).toEqual(left(new InvalidImageError('any error')))
  })

  test('Should return InvalidAnswerError if answer is invalid', () => {
    jest.spyOn(Answer, 'create').mockReturnValueOnce(
      left(new InvalidAnswerError('any error'))
    )

    const sut = SurveyAnswer.create({ image, answer })

    expect(sut).toEqual(left(new InvalidAnswerError('any error')))
  })
})
