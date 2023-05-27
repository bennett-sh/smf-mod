export interface IResource {
  from: string
  to: string
}
export interface IOptionData {
  resources: (string | IResource)[]
}

export type TOption = string | { prefix: string, name: string }
export type TResource = string | { from: string, to: string }
export type TChunk = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29
