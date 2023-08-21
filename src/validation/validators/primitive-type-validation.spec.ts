import { ValidationTypeError } from '../../presentation/errors'
import { left } from '../../shared/either'
import { PrimitiveTypeValidation } from './primitive-type-validation'

describe('PrimitiveType Validation', () => {
  test('Should return ValidationTypeError if validation fails', () => {
    const sut = new PrimitiveTypeValidation('name', 'string')
    const result = sut.validate({
      name: 0,
      email: 'any_email@mail.com'
    })
    expect(result).toEqual(left(new ValidationTypeError('name')))
  })
})
