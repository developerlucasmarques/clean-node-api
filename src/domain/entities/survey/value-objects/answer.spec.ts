import { left, right } from '../../../../shared/either'
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

  test('Should return InvalidAnswerError if answer contains more than 300 characters', () => {
    const answer = 'a'.repeat(301)
    const sut = Answer.create(answer)
    expect(sut).toEqual(left(new InvalidAnswerError('contains more than 300 characters')))
  })

  test('Should remove spaces at the beginning and at the end', () => {
    const sut = Answer.create(' any answer  ')
    expect(sut).toEqual(right({ answer: 'any answer' }))
  })
})
