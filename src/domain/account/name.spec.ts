import { InvalidNameError } from '../errors/invalid-name-error'
import { Name } from './name'

describe('Name Value Object', () => {
  test('Should return InvalidNameError if length of name is less than 3 caracters', () => {
    const sut = Name.create('ab')
    expect(sut.value).toEqual(new InvalidNameError('ab'))
  })

  test('Should return InvalidNameError if length of name is greater than 50 caracters', () => {
    const name = 'any_name_any_name_any_name_any_name_any_name_any_na'
    const sut = Name.create(name)
    expect(sut.value).toEqual(new InvalidNameError(name))
  })

  test('Should remove the spaces at the beginning and at the end of the name', () => {
    const sut = Name.create(' any_name ')
    expect(sut.value).toEqual({ name: 'any_name' })
  })
})
