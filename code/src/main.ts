import { createPatch, createEntity } from 'quickentity-script'
import { cp, lstat, mkdir, readdir, rm, writeFile } from 'fs/promises'
import  type{ TResource } from './types'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import { createRepository } from 'repository-script'

const CONTENT_FOLDER = join('../', 'content.generated')

async function removeDir(path: string): Promise<void> {
  if(existsSync(path)) await rm(path, { recursive: true, force: true })
}

async function recreateDir(path: string): Promise<void> {
  await removeDir(path)
  await mkdir(path, { recursive: true })
}

async function isFolder(path: string): Promise<boolean> {
  return (await lstat(path)).isDirectory()
}

function tryFn<T>(fn: () => T, onError: (error: Error) => void): T {
  try {
    return fn()
  } catch(err) {
    onError(err)
  }
}

function joinOr(a: string, b: string, or: string): string {
  return a || b ? `${a ?? ''}${b ?? ''}` : or
}

async function makeEverything() {
  await recreateDir(CONTENT_FOLDER)

  for(const f of await readdir(join('dist', 'content'))) {
    await makeFile(f)
  }
}

async function makeFile(f: string) {
  const isFolderMod = await isFolder(join('dist', 'content', f))

  if(isFolderMod) {
    for(const f1 of await readdir(join('dist', 'content', f))) {
      return await makeFile(
        join(
          f, f1
        )
      )
    }
  }

  // skip non-js files
  if(!f.endsWith('.js')) return

  const mod = await import(`./content/${f}`)

  if(f.endsWith('.entity.patch.js')) {
    for(const _option of mod.OPTIONS ?? [null]) {
      const patch = tryFn(() => createPatch(mod.TARGET), () => {
        throw new Error(`no target exported from ${f}`)
      })
      const option = _option?.name ?? _option

      const chunkFolder = join(
        CONTENT_FOLDER,
        joinOr(_option?.prefix, option, 'content'),
        `chunk${mod.CHUNK ?? 0}`
      )
      await mkdir(chunkFolder, { recursive: true })
      await mod.create(patch, option)
      await patch.save(join(
        chunkFolder,
        `${joinOr(mod.NAME_PREFIX, mod.NAME, 'patch')}.entity.patch.json`
      ))
    }
  }
  if(f.endsWith('.entity.js')) {
    for(const _option of mod.OPTIONS ?? [null]) {
      const entity = tryFn(() => createEntity(mod.PATH, mod.SUBTYPE ?? 'template'), () => {
        throw new Error(`no valid path/subtype exported from ${f}`)
      })
      const option = _option?.name ?? _option

      const chunkFolder = join(
        CONTENT_FOLDER,
        joinOr(_option?.prefix, option, 'content'),
        `chunk${mod.CHUNK ?? 0}`
      )
      await mkdir(chunkFolder, { recursive: true })
      if(await mod.create(entity, option) ?? true) await entity.save(join(
        chunkFolder,
        `${joinOr(mod.NAME_PREFIX, mod.NAME, 'entity')}.entity.json`
      ))
    }
  }
  if(f.endsWith('.repository.js')) {
    for(const _option of mod.OPTIONS ?? [null]) {
      const repository = createRepository()
      const option = _option?.name ?? _option

      const chunkFolder = join(
        CONTENT_FOLDER,
        joinOr(_option?.prefix, option, 'content'),
        `chunk${mod.CHUNK ?? 0}`
      )
      await mkdir(chunkFolder, { recursive: true })
      if(await mod.create(repository, option) ?? true) await repository.save(join(
        chunkFolder,
        `${joinOr(mod.NAME_PREFIX, mod.NAME, 'changes')}.repository.json`
      ))
    }
  }

  for(const _option of mod.OPTIONS ?? [null]) {
    const option = _option?.name ?? _option
    const chunkFolder = join(
      CONTENT_FOLDER,
      joinOr(_option?.prefix, option, 'content'),
      `chunk${mod.CHUNK ?? 0}`
    )
    for(const resource of mod.OPTIONS_DATA?.[option]?.resources ?? []) {
      await copyResource(resource, chunkFolder, f)
    }
  }

  for(const resource of mod.RESOURCES ?? []) {
    await copyResource(
      resource,
      join(
        CONTENT_FOLDER,
        'content',
        `chunk${mod.CHUNK ?? 0}`
      ),
      f
    )
  }
}

async function copyResource(resource: TResource, chunkFolder: string, mod: string) {
  await cp(
    join(...[
      'src',
      'content',
      join(
        dirname(mod),
        (resource as any)?.from ?? resource
      )
    ]),
    join(
      chunkFolder,
      (resource as any)?.to ?? resource
    )
  )
}

async function main() {
  await makeEverything()
}

main()
