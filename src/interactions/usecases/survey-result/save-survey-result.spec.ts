import { LoadSurveyByIdRepository, SaveSurveyResultRepository } from '@/interactions/contracts/db/survey'
import { SurveyModel, SurveyResultModel } from '@/domain/models'
import { DbSaveSurveyResult } from './save-survey-result'
import { SaveSurveyResultData } from '@/domain/contracts'
import { InvalidAnswerError, InvalidSurveyError } from '@/domain/errors'

const makeFakeSaveSurveyResultData = (): SaveSurveyResultData => ({
  accountId: 'any_account_id',
  answer: 'any_answer',
  surveyId: 'any_survey_id',
  date: new Date()
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_survey_id',
  question: 'any_question',
  answers: [{
    image: 'any_url_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel =>
  Object.assign({}, makeFakeSaveSurveyResultData(), { id: 'any_survey_result_id' })

const makeSaveSurveyResulRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultData): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResult())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel | null> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

interface SutTypes {
  sut: DbSaveSurveyResult
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
  const saveSurveyResultRepositoryStub = makeSaveSurveyResulRepository()
  const sut = new DbSaveSurveyResult(
    loadSurveyByIdRepositoryStub, saveSurveyResultRepositoryStub
  )
  return {
    sut, loadSurveyByIdRepositoryStub, saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.save(makeFakeSaveSurveyResultData())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return InvalidSurveyError if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.save(makeFakeSaveSurveyResultData())
    expect(result.value).toEqual(new InvalidSurveyError('any_survey_id'))
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.save(makeFakeSaveSurveyResultData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return InvalidAnswerError if answer does not exist', async () => {
    const { sut } = makeSut()
    const fakeData = makeFakeSaveSurveyResultData()
    fakeData.answer = 'invalid_answer'
    const result = await sut.save(fakeData)
    expect(result.value).toEqual(new InvalidAnswerError('invalid_answer'))
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(makeFakeSaveSurveyResultData())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSaveSurveyResultData())
  })
})
