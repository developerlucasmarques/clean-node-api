import { left } from '../../shared/either'
import { InvalidNameError } from '../errors/invalid-name-error'
import { Name } from './name'

describe('Name Value Object', () => {
  test('Should return InvalidNameError if length of name is less than 3 caracters', () => {
    const sut = Name.create('ab')
    expect(sut).toEqual(left(new InvalidNameError('ab')))
  })

  test('Should return InvalidNameError if length of name is greater than 50 caracters', () => {
    const name = 'any_name_any_name_any_name_any_name_any_name_any_na'
    const sut = Name.create(name)
    expect(sut).toEqual(left(new InvalidNameError(name)))
  })
})
