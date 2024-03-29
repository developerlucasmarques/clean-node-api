import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  test('Should return a MissinParamError if input not contain field name', () => {
    const sut = new RequiredFieldValidation<any>('field')
    const result = sut.validate({ name: 'any name' })
    expect(result.value).toEqual(new MissingParamError('field'))
  })

  test('Should return a MissinParamError if field is empty on input', () => {
    const sut = new RequiredFieldValidation<any>('field')
    const result = sut.validate({
      name: 'any name',
      field: ''
    })
    expect(result.value).toEqual(new MissingParamError('field'))
  })

  test('Should return null if input contain field name', () => {
    const sut = new RequiredFieldValidation<any>('field')
    const result = sut.validate({
      name: 'any name',
      field: 'any field'
    })
    expect(result.value).toBe(null)
  })
})
