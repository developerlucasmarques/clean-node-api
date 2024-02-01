import { Validation } from '@/presentation/contracts'
import { SaveSurveyResultDataController } from '@/presentation/types'
import { OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeSaveSurveyResultValidation = (): ValidationComposite<SaveSurveyResultDataController> => {
  const validations: Array<Validation<SaveSurveyResultDataController>> = []
  validations.push(new RequiredFieldValidation('answer'))
  validations.push(
    new PrimitiveTypeValidation('answer', 'string'),
    new OnlyRequiredFieldsValidation(['answer'])
  )
  return new ValidationComposite(validations)
}
