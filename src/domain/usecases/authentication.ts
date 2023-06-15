export interface LoginModel {
  email: string
  password: string
}

export interface Authentication {
  auth: (loginData: LoginModel) => Promise<string>
}
