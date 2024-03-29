import dotenv from 'dotenv'

dotenv.config()

export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT ?? 5050,
  jwtSecretKey: process.env.JWT_SECRET_KEY ?? 'secret_key_Ls9a8çF0b4c3e5T6g7h2X1Qw3E4r5T6y7'
}
