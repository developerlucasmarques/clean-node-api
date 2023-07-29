import { left } from '../../../../shared/either'
import { InvalidQuestionError } from '../errors'
import { Question } from './question'

describe('Question Value Object', () => {
  test('Should return InvalidQuestionError if question not provided', () => {
    const sut = Question.create('')
    expect(sut).toEqual(left(new InvalidQuestionError()))
  })
})
