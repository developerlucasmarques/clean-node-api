import { ListWithRequiredFields, OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, Validation, ValidationComposite } from '@/validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['question', 'answers']
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
