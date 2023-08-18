import { Either, left } from '../../../shared/either'
import { InvalidAnswerError, InvalidImageError, InvalidQuestionError } from './errors'
import { Question } from './value-objects/question'
import { Survey, SurveyData } from './survey'
import { SurveyAnswer } from './value-objects'
import MockDate from 'mockdate'

const makeFakeSurveyData = (): SurveyData => ({
  question: 'any_question',
  answers: [{
    image: 'http://valid-image-url.com',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeSut = (): Either<InvalidQuestionError, Survey> => {
  const sut = Survey.create(makeFakeSurveyData())
  return sut
}

describe('Survey Entity', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeAll(() => {
    MockDate.reset()
  })

  test('Should return InvalidQuestionError if Question return this error', () => {
    jest.spyOn(Question, 'create').mockReturnValueOnce(
      left(new InvalidQuestionError('any message'))
    )
    const sut = makeSut()
    expect(sut).toEqual(left(new InvalidQuestionError('any message')))
  })

  test('Should return InvalidImageError if SurveyAnswer return this error', () => {
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(
      left(new InvalidImageError('any message'))
    )
    const sut = makeSut()
    expect(sut).toEqual(left(new InvalidImageError('any message')))
  })

  test('Should return InvalidAnswerError if SurveyAnswer return this error', () => {
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(
      left(new InvalidAnswerError('any message'))
    )
    const sut = makeSut()
    expect(sut).toEqual(left(new InvalidAnswerError('any message')))
  })

  test('Should return the first error if more than one SurveyAnswer validation fails', () => {
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(left(new Error()))
    jest.spyOn(SurveyAnswer, 'create').mockReturnValueOnce(
      left(new InvalidAnswerError('any message'))
    )
    const sut = makeSut()
    expect(sut).toEqual(left(new Error()))
  })
})
