import { OnlyRequiredFieldsValidation, RequiredFieldValidation, Validation, ValidationComposite } from '../../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    const requiredFields = ['question', 'answers']
    for (const fileld of requiredFields) {
      validations.push(new RequiredFieldValidation(fileld))
    }
    validations.push(new OnlyRequiredFieldsValidation(requiredFields))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
