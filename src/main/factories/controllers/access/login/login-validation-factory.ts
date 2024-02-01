import { EmailValidation, RequiredFieldValidation, ValidationComposite, OnlyRequiredFieldsValidation, PrimitiveTypeValidation } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { Validation } from '@/presentation/contracts'
import { AuthenticationData } from '@/domain/contracts'

export const makeLoginValidation = (): ValidationComposite<AuthenticationData> => {
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
    new EmailValidation('email', new EmailValidatorAdapter())
  )
  return new ValidationComposite(validations)
}
