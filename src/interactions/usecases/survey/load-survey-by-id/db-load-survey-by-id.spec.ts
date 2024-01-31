import { LoadSurveyByIdRepository } from '@/interactions/contracts/db'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { SurveyModel } from '@/domain/models'
import MockDate from 'mockdate'

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_survey_id',
  question: 'any_question',
  answers: [{
    image: 'any_url_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel | null> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

interface SutTypes {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyByIdRepositoryStub }
}

describe('DbLoadSurveyById UseCase', () => {
  beforeAll(() => { MockDate.set(new Date()) })

  afterAll(() => { MockDate.reset() })

  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('any_survey_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return null if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.loadById('any_survey_id')
    expect(result).toBe(null)
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.loadById('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should return an SurveyModel on success', async () => {
    const { sut } = makeSut()
    const result = await sut.loadById('any_survey_id')
    expect(result).toEqual(makeFakeSurvey())
  })
})
