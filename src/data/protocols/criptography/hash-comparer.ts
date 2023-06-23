export interface HashComparerData {
  value: string
  hash: string
}

export interface HashComparer {
  compare: (hashComparerData: HashComparerData) => Promise<boolean>
}
