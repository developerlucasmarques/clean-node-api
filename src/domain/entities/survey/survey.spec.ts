import { left, right } from '@/shared/either'
import MockDate from 'mockdate'
import { InvalidAnswerError, InvalidAnswersError, InvalidImageError, InvalidQuestionError } from './errors'
import { Survey } from './survey'
import { SurveyData } from './survey-types'
import { SurveyAnswer } from './value-objects'
import { Question } from './value-objects/question'

jest.mock('@/domain/entities/survey/value-objects/question', () => ({
  Question: {
    create: jest.fn(() => { return right({ question: 'any_question' }) })
  }
}))

jest.mock('@/domain/entities/survey/value-objects/question', () => ({
  Question: {
    create: jest.fn(() => { return right({ question: 'any_question' }) })
  }
}))

jest.mock('@/domain/entities/survey/value-objects/survey-answer', () => ({
  SurveyAnswer: {
    create: jest.fn(() => {
      return right({
        answer: { answer: 'any_answer' },
        image: { image: 'valid_image_url' }
      })
    })
  }
}))

const makeFakeSurveyData = (): SurveyData => ({
  question: 'any_question',
  answers: [{
    image: 'valid_image_url',
    answer: 'any_answer'
  }],
  date: new Date()
})

describe('Survey Entity', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Question with correct question', () => {
    const createSpy = jest.spyOn(Question, 'create')
    Survey.create(makeFakeSurveyData())
    expect(createSpy).toHaveBeenCalledWith('any_question')
  })

  test('Should return InvalidQuestionError if Question return this error', () => {
    jest.spyOn(Question, 'create').mockReturnValueOnce(
      left(new InvalidQuestionError('any message'))
    )
    const sut = Survey.create(makeFakeSurveyData())
    expect(sut).toEqual(left(new InvalidQuestionError('any message')))
  })

  test('Should call SurveyAnswer with correct values', () => {
    const createSpy = jest.spyOn(SurveyAnswer, 'create')
    Survey.create(makeFakeSurveyData())
    expect(createSpy).toHaveBeenCalledWith({
      image: 'valid_image_url', answer: 'any_answer'
    })
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

  test('Should return InvalidAnswersError if answers is empty', () => {
    const data: SurveyData = {
      question: 'any_question',
      answers: [],
      date: new Date()
    }
    const sut = Survey.create(data)
    expect(sut).toEqual(left(new InvalidAnswersError('cannot be empty')))
  })

  test('Should return an Survey on success', () => {
    const sut = Survey.create(makeFakeSurveyData())
    expect(sut.value).toEqual({
      question: { question: 'any_question' },
      answers: [{
        answer: { answer: 'any_answer' },
        image: { image: 'valid_image_url' }
      }],
      date: new Date()
    })
  })

  test('Should return the first error if more than one SurveyAnswer validation fails', () => {
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(left(new Error()))
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(
      left(new InvalidAnswerError('any message'))
    )
    const sut = Survey.create(makeFakeSurveyData())
    expect(sut).toEqual(left(new Error()))
  })
})
