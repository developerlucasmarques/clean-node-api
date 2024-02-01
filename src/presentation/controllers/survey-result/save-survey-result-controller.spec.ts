import { HttpRequest, Validation } from '@/presentation/contracts'
import { SaveSurveyResultDataController } from '@/presentation/types'
import { Either, left, right } from '@/shared/either'
import MockDate from 'mockdate'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { badRequest } from '@/presentation/helpers/http-helper'

const makeValidationStub = (): Validation<SaveSurveyResultDataController> => {
  class ValidationStub implements Validation<SaveSurveyResultDataController> {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  }
})

interface SutTypes {
  sut: SaveSurveyResultController
  validationStub: Validation<SaveSurveyResultDataController>
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new SaveSurveyResultController(validationStub)
  return { sut, validationStub }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => { MockDate.set(new Date()) })

  afterAll(() => { MockDate.reset() })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })
})
