import { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeSaveSurveyResultValidation } from './save-survey-result-validation-factory'
import { SaveSurveyResultDataController } from '@/presentation/types'

jest.mock('@/validation/validators/validation-composite')

describe('SaveSurveyResultValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSaveSurveyResultValidation()
    const validations: Array<Validation<SaveSurveyResultDataController>> = []
    validations.push(new RequiredFieldValidation('answer'))
    validations.push(
      new PrimitiveTypeValidation('answer', 'string'),
      new OnlyRequiredFieldsValidation(['answer'])
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
