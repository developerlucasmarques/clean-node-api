import { ListWithRequiredFields, OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, Validation, ValidationComposite } from '../../../../../validation/validators'
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
    const listWithRequiredFields: ListWithRequiredFields = {
      listName: 'answers',
      listFields: ['image', 'answer']
    }
    validations.push(
      new PrimitiveTypeValidation('question', 'string'),
      new OnlyRequiredFieldsValidation(requiredFields, listWithRequiredFields)
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
