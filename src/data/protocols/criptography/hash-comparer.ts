export interface HashComparerData {
  value: string
  hash: string
}

export interface HashComparer {
  comparer: (hashComparerData: HashComparerData) => Promise<boolean>
}
