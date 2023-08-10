import { RequiredFieldValidation, Validation, ValidationComposite } from '../../../../../validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiderFields = ['question', 'answers']
  for (const field of requiderFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
