import { left } from '../../../../shared/either'
import { InvalidQuestionError } from '../errors'
import { Question } from './question'

describe('Question Value Object', () => {
  test('Should return InvalidQuestionError if question not provided', () => {
    const sut = Question.create('')
    expect(sut).toEqual(left(new InvalidQuestionError('Question not provided')))
  })

  test('Should return InvalidQuestionError if question contains less than 7 characters', () => {
    const sut = Question.create('1234')
    expect(sut).toEqual(left(new InvalidQuestionError('Contains less than 7 characters')))
  })
})
