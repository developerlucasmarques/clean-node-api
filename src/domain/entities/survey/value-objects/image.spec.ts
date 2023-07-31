import { left } from '../../../../shared/either'
import { InvalidImageError } from '../errors'
import { Image } from './image'

describe('Image ValueObject', () => {
  test("Should return an InvalidImageError if the image don't have link format - 1", () => {
    const sut = Image.create('')
    expect(sut).toEqual(left(new InvalidImageError("don't have link format")))
  })

  test("Should return an InvalidImageError if the image don't have link format - 2", () => {
    const sut = Image.create('invalidURL')
    expect(sut).toEqual(left(new InvalidImageError("don't have link format")))
  })

  test("Should return an InvalidImageError if the image don't have link format - 3", () => {
    const sut = Image.create('http//jsowl')
    expect(sut).toEqual(left(new InvalidImageError("don't have link format")))
  })

  test("Should return an InvalidImageError if the image don't have link format - 4", () => {
    const sut = Image.create('htt/url')
    expect(sut).toEqual(left(new InvalidImageError("don't have link format")))
  })
})
