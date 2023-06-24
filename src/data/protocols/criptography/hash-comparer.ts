export interface HashCompareData {
  value: string
  hash: string
}

export interface HashComparer {
  compare: (hashCompareData: HashCompareData) => Promise<boolean>
}
