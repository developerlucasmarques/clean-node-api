import { left } from '../../../shared/either'
import { InvalidQuestionError } from './errors'
import { Question } from './value-objects/question'
import { Survey } from './survey'

describe('Survey Entity', () => {
  test('Should return InvalidQuestionError if Question return a error', () => {
    jest.spyOn(Question, 'create').mockReturnValueOnce(
      left(new InvalidQuestionError('any message'))
    )
    const sut = Survey.create({ question: 'any question' })
    expect(sut).toEqual(left(new InvalidQuestionError('any message')))
  })
})
