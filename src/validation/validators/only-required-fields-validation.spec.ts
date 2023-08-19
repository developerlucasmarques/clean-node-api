import { left } from '../../shared/either'
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
})
