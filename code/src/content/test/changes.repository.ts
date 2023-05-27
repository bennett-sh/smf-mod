
import type { TChunk, TOption, TResource } from '../../types'
import type { Repository } from 'repository-script'

export const RESOURCES: TResource[] = ['resource.txt']
export const OPTIONS: TOption[] = ['ui', null]
export const CHUNK: TChunk = 0

export async function create(repository: Repository, option?: string) {
  repository.addItem({ Test: true, Option: option })
}
