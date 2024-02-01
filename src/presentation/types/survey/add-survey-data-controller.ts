import { AddSurveyData } from '@/domain/contracts'

export type AddSurveyDataController = Omit<AddSurveyData, 'date'>
