import { Survey } from '@/domain/entities/survey'
import { AddSurveyData } from '@/domain/usecases'
import { left, right } from '@/shared/either'
import { AddSurveyRepository } from '@/interactions/protocols/db/survey'
import { DbAddSurvey } from '.'
import MockDate from 'mockdate'

jest.mock('@/domain/entities/survey/survey', () => ({
  Survey: {
    create: jest.fn(() => {
      return right({
        question: 'any_question',
        answers: [{
          image: 'http://valid-image-url.com',
          answer: 'any_answer'
        }],
        date: new Date()
      })
    })
  }
}))

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyData): Promise<void> {
      Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeFakeSurveyData = (): AddSurveyData => ({
  question: 'any_question',
  answers: [{
    image: 'http://valid-image-url.com',
    answer: 'any_answer'
  }],
  date: new Date()
})

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return { sut, addSurveyRepositoryStub }
}

describe('DbAdddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(makeFakeSurveyData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData())
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(async () => {
      await Promise.reject(new Error())
    })
    const promise = sut.add(makeFakeSurveyData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an Error if Survey creation fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(Survey, 'create').mockReturnValueOnce(
      left(new Error())
    )
    const result = await sut.add(makeFakeSurveyData())
    expect(result).toEqual(left(new Error()))
  })

  test('Should return null if add on success', async () => {
    const { sut } = makeSut()
    const result = await sut.add(makeFakeSurveyData())
    expect(result).toEqual(right(null))
  })
})
