import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeAll(async () => {
    const accountColletion = await MongoHelper.getCollection('accounts')
    accountColletion.deleteMany({})
  })
  test('Shound return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'password1234',
        passwordConfirmation: 'password1234'
      })
      .expect(200)
  })
})
