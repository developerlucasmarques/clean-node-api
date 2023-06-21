import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('CompareFields Validation', () => {
  test('Should return a InvalidaParamError if comparation fails', () => {
    const sut = new CompareFieldsValidation('fieldName', 'fieldToCompareName')
    const result = sut.validate({
      name: 'any name',
      fieldName: 'any field',
      fieldToCompareName: 'invalid field'
    })
    expect(result.value).toEqual(new InvalidParamError('fieldToCompareName'))
  })
})
