import { left } from '../../../../shared/either'
import { InvalidAnswerError } from '../errors'
import { Answer } from './answer'

describe('Answer ValueObject', () => {
  test('Should return InvalidAnswerError if answer not provided', () => {
    const sut = Answer.create('')
    expect(sut).toEqual(left(new InvalidAnswerError('not provided')))
  })

  test('Should return InvalidAnswerError if answer contains less than 3 characters', () => {
    const sut = Answer.create('ab')
    expect(sut).toEqual(left(new InvalidAnswerError('contains less than 3 characters')))
  })
})
