import { left, right } from '@/shared/either'
import { InvalidQuestionError } from '../errors'
import { Question } from './question'

describe('Question Value Object', () => {
  test('Should return InvalidQuestionError if question not provided', () => {
    const sut = Question.create('')
    expect(sut).toEqual(left(new InvalidQuestionError('not provided')))
  })

  test('Should return InvalidQuestionError if question contains less than 7 characters', () => {
    const sut = Question.create('1234')
    expect(sut).toEqual(left(new InvalidQuestionError('contains less than 7 characters')))
  })

  test('Should return InvalidQuestionError if question contains more than 300 characters', () => {
    const question = 'A'.repeat(301)
    const sut = Question.create(question)
    expect(sut).toEqual(left(new InvalidQuestionError('contains more than 300 characters')))
  })

  test('Should remove spaces at the beginning and end of the question', () => {
    const sut = Question.create('   any question    ')
    expect(sut).toEqual(right({ question: 'any question' }))
  })

  test('Should return Question if validation on success', () => {
    const sut = Question.create('any question')
    expect(sut).toEqual(right({ question: 'any question' }))
  })
})
