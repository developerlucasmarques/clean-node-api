import { Survey } from '../../../domain/entities/survey'
import { AddSurveyData } from '../../../domain/usecases/add-survey'
import { left } from '../../../shared/either'
import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'
import { DbAddSurvey } from './db-add-survey'

const makeFakeSurveyData = (): AddSurveyData => ({
  question: 'any_question',
  answers: [{
    image: 'http://valid-image-url.com',
    answer: 'any_answer'
  }]
})

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyData): Promise<void> {
      Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAdddSurvey UseCase', () => {
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
})
