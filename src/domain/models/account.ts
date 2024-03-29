import { AccountRole } from './account-role'

export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
  accessToken?: string
  role: AccountRole
}
