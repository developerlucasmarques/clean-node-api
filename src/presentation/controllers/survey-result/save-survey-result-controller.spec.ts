import { SaveSurveyResult, SaveSurveyResultData, SaveSurveyResultResponse } from '@/domain/contracts'
import { SurveyResultModel } from '@/domain/models'
import { HttpRequest, Validation } from '@/presentation/contracts'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { SaveSurveyResultDataController } from '@/presentation/types'
import { Either, left, right } from '@/shared/either'
import MockDate from 'mockdate'
import { SaveSurveyResultController } from './save-survey-result-controller'

const makeFakeRequest = (): HttpRequest => ({
  headers: { accountId: 'any_account_id' },
  params: { surveyId: 'any_survey_id' },
  body: { answer: 'any_answer' }
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_survey_result_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeValidationStub = (): Validation<SaveSurveyResultDataController> => {
  class ValidationStub implements Validation<SaveSurveyResultDataController> {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultData): Promise<SaveSurveyResultResponse> {
      return await Promise.resolve(right(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultStub()
}

interface SutTypes {
  sut: SaveSurveyResultController
  validationStub: Validation<SaveSurveyResultDataController>
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(validationStub, saveSurveyResultStub)
  return { sut, validationStub, saveSurveyResultStub }
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

  test('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error('any_message')
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_message')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      answer: 'any_answer',
      accountId: 'any_account_id',
      date: new Date()
    })
  })

  test('Should return 400 if SaveSurveyResult fails', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => {
      throw new Error('any_message')
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_message')))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeSurveyResult()))
  })
})
