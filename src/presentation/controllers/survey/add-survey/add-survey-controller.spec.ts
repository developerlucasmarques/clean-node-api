import { HttpRequest, Validation } from '.'
import { AddSurveyController } from './add-survey-controller'
import { Either, right } from '../../../../shared/either'

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
})
