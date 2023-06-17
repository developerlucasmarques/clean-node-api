import { left } from '../../shared/either'
import { InvalidNameError } from '../errors/invalid-name-error'
import { Account } from './account'
import { Name } from './value-objects/name'

describe('Account', () => {
  test('Should call Name with correct values', () => {
    const createSpy = jest.spyOn(Name, 'create')
    Account.create('any name')
    expect(createSpy).toHaveBeenCalledWith('any name')
  })

  test('Should return InvalidNameError if Name return InvalidNameError', () => {
    jest.spyOn(Name, 'create').mockReturnValueOnce(
      left(new InvalidNameError('invalid name'))
    )
    const sut = Account.create('invalid name')
    expect(sut.value).toEqual(new InvalidNameError('invalid name'))
  })
})
