import { SignUpController } from '@/presentation/controllers/access/signup/signup-controller'
import { Controller } from '@/presentation/contracts'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeSignUpValidation(), makeDbAddAccount())
  return makeLogControllerDecorator(controller)
}
