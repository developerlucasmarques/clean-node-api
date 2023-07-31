import { left, right } from '../../../../shared/either'
import { InvalidImageError } from '../errors'
import { Image } from './image'

describe('Image ValueObject', () => {
  test('Should return an InvalidImageError if the image was not provided', () => {
    const sut = Image.create('')
    expect(sut).toEqual(left(new InvalidImageError('was not provided')))
  })

  test("Should return an InvalidImageError if the image don't have link format - 1", () => {
    const sut = Image.create('url-invalid')
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

  test('Should return Image if image is valid - 1', () => {
    const sut = Image.create('www.google.com')
    expect(sut).toEqual(right({ image: 'www.google.com' }))
  })

  test('Should return Image if image is valid - 2', () => {
    const sut = Image.create('https://www.google.com')
    expect(sut).toEqual(right({ image: 'https://www.google.com' }))
  })

  test('Should return Image if image is valid - 3', () => {
    const sut = Image.create('https://github.com/codedbylucas')
    expect(sut).toEqual(right({ image: 'https://github.com/codedbylucas' }))
  })

  test('Should return Image if image is valid - 4', () => {
    const sut = Image.create('https://github.com/codedbylucas?tab=repositories')
    expect(sut).toEqual(right({ image: 'https://github.com/codedbylucas?tab=repositories' }))
  })

  test('Should return Image if image is valid - 5', () => {
    const sut = Image.create('https://github.com/codedbylucas/clean-node-api')
    expect(sut).toEqual(right({ image: 'https://github.com/codedbylucas/clean-node-api' }))
  })

  test('Should remove spaces at the beginning and at the end', () => {
    const sut = Image.create('  https://image.com  ')
    expect(sut).toEqual(right({ image: 'https://image.com' }))
  })
})
