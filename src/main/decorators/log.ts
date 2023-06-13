import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.controller.handle(httpRequest)
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: ''
    }
    return await Promise.resolve(httpResponse)
  }
}
