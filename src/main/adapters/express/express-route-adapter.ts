import { Request, Response } from 'express'
import { Controller, HttpRequest } from '@/presentation/contracts'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      headers: req.headers
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        name: httpResponse.body.name,
        error: httpResponse.body.message,
        statusCode: httpResponse.statusCode
      })
    }
  }
}
