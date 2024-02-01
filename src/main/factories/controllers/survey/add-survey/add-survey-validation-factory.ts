import { Validation } from '@/presentation/contracts'
import { AddSurveyDataController } from '@/presentation/types'
import { ListWithRequiredFields, OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite<AddSurveyDataController> => {
  const validations: Array<Validation<AddSurveyDataController>> = []
  const requiredFields: Array<keyof AddSurveyDataController> = ['question', 'answers']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
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
  return new ValidationComposite(validations)
}
