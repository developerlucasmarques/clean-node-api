import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

interface CompareFieldsValidationType {
  name: string
  fieldName: string
  fieldToCompareName: string
}

const makeSut = (): CompareFieldsValidation<CompareFieldsValidationType> => {
  return new CompareFieldsValidation<CompareFieldsValidationType>('fieldName', 'fieldToCompareName')
}

describe('CompareFields Validation', () => {
  test('Should return a InvalidaParamError if the comparation fails', () => {
    const sut = makeSut()
    const result = sut.validate({
      name: 'any name',
      fieldName: 'any field',
      fieldToCompareName: 'invalid field'
    })
    expect(result.value).toEqual(new InvalidParamError('fieldToCompareName'))
  })

  test('Should return null if compartion succeeds', () => {
    const sut = makeSut()
    const result = sut.validate({
      name: 'any name',
      fieldName: 'any field',
      fieldToCompareName: 'any field'
    })
    expect(result.value).toBe(null)
  })
})
