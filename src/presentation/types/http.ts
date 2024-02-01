export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  params?: any
  headers?: any
  body?: any
}
