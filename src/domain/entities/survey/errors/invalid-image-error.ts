export class InvalidImageError extends Error {
  constructor (message: string) {
    super(`The image ${message}`)
    this.name = 'InvalidImageError'
  }
}
