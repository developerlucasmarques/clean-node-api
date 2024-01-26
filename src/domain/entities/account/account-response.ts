import { Either } from '@/shared/either'
import { InvalidEmailError, InvalidNameError, InvalidPasswordError } from './errors'
import { Account } from './account'

export type AccountResponse = Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, Account>
