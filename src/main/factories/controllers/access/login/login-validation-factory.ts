import { EmailValidation, RequiredFieldValidation, ValidationComposite, Validation, OnlyRequiredFieldsValidation, PrimitiveTypeValidation } from '../../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
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
    new EmailValidation('email', new EmailValidatorAdapter())
  )
  return new ValidationComposite(validations)
}
