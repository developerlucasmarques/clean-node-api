import { left, right } from '../../shared/either'
import { UnnecessaryFieldError } from '../../presentation/errors/unnecessary-field-error'
import { OnlyRequiredFieldsValidation } from './only-required-fields-validation'

describe('OnlyRequiredField Validation', () => {
  test('Should return UnnecessaryFieldError if received field unnecessary', () => {
    const sut = new OnlyRequiredFieldsValidation(['name', 'email'])
    const response = sut.validate({
      name: 'any_name',
      email: 'any_email@mail.com',
      role: 'any_role'
    })
    expect(response).toEqual(left(new UnnecessaryFieldError('role')))
  })

  test('Should return null if received only required fields', () => {
    const sut = new OnlyRequiredFieldsValidation(['name', 'email'])
    const result = sut.validate({
      name: 'any_name',
      email: 'any_email@mail.com'
    })
    expect(result).toEqual(right(null))
  })
})
