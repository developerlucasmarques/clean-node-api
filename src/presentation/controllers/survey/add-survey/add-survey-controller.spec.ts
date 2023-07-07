import { HttpRequest, Validation, badRequest } from '.'
import { AddSurveyController } from './add-survey-controller'
import { Either, left, right } from '../../../../shared/either'

describe('AddSurvey Controller', () => {
  const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
      validate (input: any): Either<Error, null> {
        return right(null)
      }
    }
    return new ValidationStub()
  }

  const makeFakeRequest = (): HttpRequest => ({
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_url_image',
        answer: 'any_answer'
      }]
    }
  })

  interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
  }

  const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const sut = new AddSurveyController(validationStub)
    return {
      sut,
      validationStub
    }
  }

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(left(new Error()))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
