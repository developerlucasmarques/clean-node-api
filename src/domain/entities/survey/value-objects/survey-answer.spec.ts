import { Answer, Image, SurveyAnswer } from '.'
import { left, right } from '@/shared/either'
import { InvalidAnswerError, InvalidImageError } from '../errors'

const image = 'http://valid-image-url.com'
const answer = 'valid_answer'

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

  test('Should return SurveyAnswer if all datas is valid', () => {
    const sut = SurveyAnswer.create({ image, answer })
    expect(sut).toEqual(right({
      image: Image.create(image).value,
      answer: Answer.create(answer).value
    }))
  })

  test('Should return SurveyAnswer even if the image is undefined', () => {
    const sut = SurveyAnswer.create({ image: undefined, answer })
    expect(sut).toEqual(right({
      answer: Answer.create(answer).value
    }))
  })
})
