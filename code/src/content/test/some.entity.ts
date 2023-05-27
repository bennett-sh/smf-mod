import { getTemplateFactoryPath, type TSubType, type QNEntity, type IPath, CommonPaths } from 'quickentity-script'
import type { TChunk, TOption, TResource } from '../../types'

export const PATH: IPath = { ...getTemplateFactoryPath('[assembly:/_pro/my_cool_entity.entitytemplate]') }
export const RESOURCES: TResource[] = ['resource.txt']
export const OPTIONS: TOption[] = ['ui', null]
export const SUBTYPE: TSubType = 'template'
export const NAME: string = 'some'
export const CHUNK: TChunk = 0

export async function create(entity: QNEntity, option?: string) {
  const root = entity.addRoot({ ...CommonPaths.Entity })

  if(option == 'ui') root.addChild({ ...CommonPaths.Entity, name: 'UI Enabled' })
  else root.addChild({ ...CommonPaths.Entity, name: 'UI Disabled' })
}
