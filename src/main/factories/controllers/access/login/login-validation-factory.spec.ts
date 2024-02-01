import { EmailValidation, OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/contracts'
import { EmailValidator } from '@/validation/contracts/email-validator'
import { makeLoginValidation } from './login-validation-factory'
import { AuthenticationData } from '@/domain/contracts'

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
    const validations: Array<Validation<AuthenticationData>> = []
    const requiredFields: Array<keyof AuthenticationData> = ['email', 'password']
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
