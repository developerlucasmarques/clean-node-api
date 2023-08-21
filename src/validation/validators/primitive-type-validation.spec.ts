import { ValidationTypeError } from '../../presentation/errors'
import { left, right } from '../../shared/either'
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

  test('Should return null if validation success', () => {
    const sut = new PrimitiveTypeValidation('name', 'string')
    const result = sut.validate({
      name: 'any name',
      email: 'any_email@mail.com'
    })
    expect(result).toEqual(right(null))
  })
})
