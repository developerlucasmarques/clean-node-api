import { RequiredFieldValidation, Validation, ValidationComposite } from '../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    const requiderFields = ['question', 'answers']
    for (const fileld of requiderFields) {
      validations.push(new RequiredFieldValidation(fileld))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
