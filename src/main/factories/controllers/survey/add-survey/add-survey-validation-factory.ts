import { OnlyRequiredFieldsValidation, RequiredFieldValidation, Validation, ValidationComposite } from '../../../../../validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['question', 'answers']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new OnlyRequiredFieldsValidation(requiredFields))
  return new ValidationComposite(validations)
}
