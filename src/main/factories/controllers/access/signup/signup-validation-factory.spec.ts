import { CompareFieldsValidation, RequiredFieldValidation, ValidationComposite, OnlyRequiredFieldsValidation, PrimitiveTypeValidation } from '@/validation/validators'
import { makeSignUpValidation } from './signup-validation-factory'
import { Validation } from '@/presentation/contracts'
import { SignUpDataController } from '@/presentation/types'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Array<Validation<SignUpDataController>> = []
    const requiredFields: Array<keyof SignUpDataController> = [
      'name', 'email', 'password', 'passwordConfirmation'
    ]
    for (const field of requiredFields) {
      validations.push(
        new RequiredFieldValidation(field),
        new PrimitiveTypeValidation(field, 'string')
      )
    }
    validations.push(
      new OnlyRequiredFieldsValidation(requiredFields),
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
