import { HttpRequest, Validation, badRequest, AddSurvey, AddSurveyData, serverError, noContent } from '.'
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

  const makeAddSurveyStub = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
      async add (data: AddSurveyData): Promise<void> {
        Promise.resolve()
      }
    }
    return new AddSurveyStub()
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
    addSurveyStub: AddSurvey
  }

  const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const addSurveyStub = makeAddSurveyStub()
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return {
      sut,
      validationStub,
      addSurveyStub
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

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(async () => {
      await Promise.reject(new Error())
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
