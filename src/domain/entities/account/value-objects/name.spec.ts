import { InvalidNameError } from '../../errors/invalid-name-error'
import { Name } from './name'

describe('Name Value Object', () => {
  test('Should return InvalidNameError if length of name is less than 3 characters', () => {
    const sut = Name.create('ab')
    expect(sut.value).toEqual(new InvalidNameError('ab'))
  })

  test('Should return InvalidNameError if length of name is greater than 50 characters', () => {
    const name = 'any name'.repeat(7)
    const sut = Name.create(name)
    expect(sut.value).toEqual(new InvalidNameError(name))
  })

  test('Should remove the spaces at the beginning and at the end of the name', () => {
    const sut = Name.create(' any name ')
    expect(sut.value).toEqual({ name: 'any name' })
  })

  test('Should return InvalidNameError if name contains number', () => {
    const sut = Name.create('any 0 name')
    expect(sut.value).toEqual(new InvalidNameError('any 0 name'))
  })

  test('Should return InvalidNameError if name contains special character', () => {
    const sut = Name.create('invalid_name')
    expect(sut.value).toEqual(new InvalidNameError('invalid_name'))
  })

  test('Should remove spaces between words if have any', () => {
    const sut = Name.create('any  name    any  name')
    expect(sut.value).toEqual({ name: 'any name any name' })
  })

  test('Should return an Name if name is valid', () => {
    const sut = Name.create('valid name')
    expect(sut.value).toEqual({ name: 'valid name' })
  })
})
