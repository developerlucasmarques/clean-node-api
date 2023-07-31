import { left } from '../../../shared/either'
import { InvalidAnswerError, InvalidImageError, InvalidQuestionError } from './errors'
import { Question } from './value-objects/question'
import { Survey, SurveyData } from './survey'
import { SurveyAnswer } from './value-objects'

const makeFakeSurveyData = (): SurveyData => ({
  question: 'any_question',
  answers: [{
    image: 'http://valid-image-url.com',
    answer: 'any_answer'
  }]
})

describe('Survey Entity', () => {
  test('Should return InvalidQuestionError if Question return this error', () => {
    jest.spyOn(Question, 'create').mockReturnValueOnce(
      left(new InvalidQuestionError('any message'))
    )
    const sut = Survey.create(makeFakeSurveyData())
    expect(sut).toEqual(left(new InvalidQuestionError('any message')))
  })

  test('Should return InvalidImageError if SurveyAnswer return this error', () => {
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(
      left(new InvalidImageError('any message'))
    )
    const sut = Survey.create(makeFakeSurveyData())
    expect(sut).toEqual(left(new InvalidImageError('any message')))
  })

  test('Should return InvalidAnswerError if SurveyAnswer return this error', () => {
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(
      left(new InvalidAnswerError('any message'))
    )
    const sut = Survey.create(makeFakeSurveyData())
    expect(sut).toEqual(left(new InvalidAnswerError('any message')))
  })
})
