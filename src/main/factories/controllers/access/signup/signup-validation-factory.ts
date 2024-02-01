import { Validation } from '@/presentation/contracts'
import { SignUpDataController } from '@/presentation/types'
import { CompareFieldsValidation, RequiredFieldValidation, ValidationComposite, OnlyRequiredFieldsValidation, PrimitiveTypeValidation } from '@/validation/validators'

export const makeSignUpValidation = (): ValidationComposite<SignUpDataController> => {
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
  return new ValidationComposite(validations)
}
