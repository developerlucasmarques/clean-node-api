import { left } from '../../../../shared/either'
import { InvalidAnswerError } from '../errors'
import { Answer } from './answer'

describe('Answer ValueObject', () => {
  test('Should return InvalidAnswerError if answer not provided', () => {
    const sut = Answer.create('')
    expect(sut).toEqual(left(new InvalidAnswerError('not provided')))
  })
})
