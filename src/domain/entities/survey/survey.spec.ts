import { Either, left, right } from '@/shared/either'
import { InvalidAnswerError, InvalidAnswersError, InvalidImageError, InvalidQuestionError } from './errors'
import { Question } from './value-objects/question'
import { Survey } from './survey'
import { SurveyAnswer } from './value-objects'
import MockDate from 'mockdate'
import { SurveyData } from './survey-types'

jest.mock('@/domain/entities/survey/value-objects/question', () => ({
  Question: {
    create: jest.fn(() => { return right({ question: 'any_question' }) })
  }
}))

const makeFakeSurveyData = (): SurveyData => ({
  question: 'any_question',
  answers: [{
    image: 'http://valid-image-url.com',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeSut = (data: SurveyData): Either<InvalidQuestionError, Survey> => {
  const sut = Survey.create(data)
  return sut
}

describe('Survey Entity', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should return InvalidQuestionError if Question return this error', () => {
    jest.spyOn(Question, 'create').mockReturnValueOnce(
      left(new InvalidQuestionError('any message'))
    )
    const sut = makeSut(makeFakeSurveyData())
    expect(sut).toEqual(left(new InvalidQuestionError('any message')))
  })

  test('Should return InvalidImageError if SurveyAnswer return this error', () => {
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(
      left(new InvalidImageError('any message'))
    )
    const sut = makeSut(makeFakeSurveyData())
    expect(sut).toEqual(left(new InvalidImageError('any message')))
  })

  test('Should return InvalidAnswerError if SurveyAnswer return this error', () => {
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(
      left(new InvalidAnswerError('any message'))
    )
    const sut = makeSut(makeFakeSurveyData())
    expect(sut).toEqual(left(new InvalidAnswerError('any message')))
  })

  test('Should return InvalidAnswersError if answers is empty', () => {
    const data: SurveyData = {
      question: 'any_question',
      answers: [],
      date: new Date()
    }
    const sut = makeSut(data)
    expect(sut).toEqual(left(new InvalidAnswersError('cannot be empty')))
  })

  test('Should return the first error if more than one SurveyAnswer validation fails', () => {
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(left(new Error()))
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(
      left(new InvalidAnswerError('any message'))
    )
    const sut = makeSut(makeFakeSurveyData())
    expect(sut).toEqual(left(new Error()))
  })
})
