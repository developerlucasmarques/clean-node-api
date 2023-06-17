import { Account } from './account'
import { Name } from './value-objects/name'

describe('Account', () => {
  test('Should call Name with correct values', () => {
    const createSpy = jest.spyOn(Name, 'create')
    Account.create('any name')
    expect(createSpy).toHaveBeenCalledWith('any name')
  })
})
