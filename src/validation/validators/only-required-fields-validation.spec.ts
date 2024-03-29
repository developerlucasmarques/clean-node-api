import { left, right } from '@/shared/either'
import { UnnecessaryFieldError } from '@/presentation/errors/unnecessary-field-error'
import { OnlyRequiredFieldsValidation } from './only-required-fields-validation'

interface OnlyRequiredFieldsValidationType {
  role?: string
  name: string
  email: string
}

const makeSut = (): OnlyRequiredFieldsValidation<OnlyRequiredFieldsValidationType> => {
  return new OnlyRequiredFieldsValidation(['name', 'email'])
}

describe('OnlyRequiredField Validation', () => {
  test('Should return UnnecessaryFieldError if received field unnecessary', () => {
    const sut = makeSut()
    const result = sut.validate({
      name: 'any_name',
      email: 'any_email@mail.com',
      role: 'any_role'
    })
    expect(result).toEqual(left(new UnnecessaryFieldError('role')))
  })

  test('Should return null if received only required fields', () => {
    const sut = makeSut()
    const result = sut.validate({
      name: 'any_name',
      email: 'any_email@mail.com'
    })
    expect(result).toEqual(right(null))
  })

  test('Should return UnnecessaryFieldError contain a field that has a list of required objects', () => {
    const requiredFields = ['name', 'email', 'list']
    const listWithRequiredFields = {
      listName: 'list',
      listFields: ['field', 'anotherField']
    }
    const sut = new OnlyRequiredFieldsValidation(requiredFields, listWithRequiredFields)
    const result = sut.validate({
      name: 'any_name',
      email: 'any_email@mail.com',
      list: [
        {
          field: 'any_field',
          anotherField: 'any_another_field'
        },
        {
          field: 'any_field',
          anotherField: 'any_another_field',
          anyField: 'any_value'
        }
      ]
    })
    expect(result).toEqual(left(new UnnecessaryFieldError('anyField')))
  })

  test('Should return null if ListWithRequiredFields validation is success', () => {
    const requiredFields = ['name', 'email', 'list']
    const listWithRequiredFields = {
      listName: 'list',
      listFields: ['field', 'anotherField']
    }
    const sut = new OnlyRequiredFieldsValidation(requiredFields, listWithRequiredFields)
    const result = sut.validate({
      name: 'any_name',
      email: 'any_email@mail.com',
      list: [
        {
          field: 'any_field',
          anotherField: 'any_another_field'
        }
      ]
    })
    expect(result).toEqual(right(null))
  })
})
