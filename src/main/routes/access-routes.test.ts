import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Access Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Shound return 200 on signup', async () => {
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

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const encryptedPassword = await hash('password1234', 12)
      await accountCollection.insertOne({
        name: 'any name',
        email: 'any_email@mail.com',
        password: encryptedPassword
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'password1234'
        })
        .expect(200)
    })
  })
})
