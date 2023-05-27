import { getPath, IPath, type QNPatch } from 'quickentity-script'
import type { TChunk, TOption } from '../types'

export const TARGET: IPath = getPath('[assembly:/_pro/design/gamecore/setpiecehelpers.template?/setpiecehelpers_activator_singlepress.entitytemplate]')
export const NAME: string = 'setpiecehelper_singlepress'
export const OPTIONS: TOption[] = ['ui', null]
export const CHUNK: TChunk = 0

export async function create(patch: QNPatch, option?: string) {
  patch
    .getEntity('cecdc1465dd13fbb')
    .addPropertyAliasConnection(
      'm_eInputAction',
      {
        originalProperty: 'm_eInputAction',
        originalEntity: 'b6dba39a251bfef1'
      }
    )
}
