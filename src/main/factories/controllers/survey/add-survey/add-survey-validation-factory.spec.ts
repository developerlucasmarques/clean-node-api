import { ListWithRequiredFields, OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { Validation } from '@/presentation/contracts'
import { AddSurveyDataController } from '@/presentation/types'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Array<Validation<AddSurveyDataController>> = []
    const requiredFields: Array<keyof AddSurveyDataController> = ['question', 'answers']
    for (const fileld of requiredFields) {
      validations.push(new RequiredFieldValidation(fileld))
    }
    const listWithRequiredFields: ListWithRequiredFields = {
      listName: 'answers',
      listFields: ['image', 'answer']
    }
    validations.push(
      new PrimitiveTypeValidation('question', 'string'),
      new PrimitiveTypeValidation('answers', 'array'),
      new OnlyRequiredFieldsValidation(requiredFields, listWithRequiredFields)
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
