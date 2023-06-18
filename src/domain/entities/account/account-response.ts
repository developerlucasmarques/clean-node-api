import { Either } from '../../../shared/either'
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'
import { InvalidPasswordError } from './errors/invalid-password-error'
import { Account } from './account'

export type AccountResponse = Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, Account>
