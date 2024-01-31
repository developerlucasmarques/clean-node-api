import { EmailValidation, RequiredFieldValidation, ValidationComposite, OnlyRequiredFieldsValidation, PrimitiveTypeValidation } from '@/validation/validators'
import { makeLoginValidation } from './login-validation-factory'
import { EmailValidator, Validation } from '@/presentation/contracts'

jest.mock('@/validation/validators/validation-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validations.push(
        new RequiredFieldValidation(field),
        new PrimitiveTypeValidation(field, 'string')
      )
    }
    validations.push(
      new OnlyRequiredFieldsValidation(requiredFields),
      new EmailValidation('email', makeEmailValidatorStub())
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
