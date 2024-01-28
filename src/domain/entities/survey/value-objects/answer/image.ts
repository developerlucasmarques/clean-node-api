import { Either, left, right } from '@/shared/either'
import { InvalidImageError } from '../../errors'

export class Image {
  private constructor (private readonly image: string) {
    Object.freeze(this)
  }

  static create (image: string): Either<InvalidImageError, Image> {
    const validateResult = Image.validate(image)
    if (validateResult) {
      return left(validateResult)
    }
    image = image.trim()
    return right(new Image(image))
  }

  private static validate (image: string): InvalidImageError | null {
    if (!image) {
      return new InvalidImageError('was not provided')
    }
    image = image.trim()
    const urlPattern = new RegExp('^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$', 'i')

    if (!urlPattern.test(image)) {
      return new InvalidImageError("don't have link format")
    }
    return null
  }
}
