import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { Controller } from '@/presentation/contracts'
import { LogControllerDecorator } from '@/presentation/decorators/log-controller-decorator'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
