import type {
  Mode,
  YarnV1LockfileEntries,
  YarnV1ParsedLockfile,
} from './ts.mjs'
import { type PackageJson } from 'type-fest'
import { readFile } from 'node:fs/promises'
import yarnpkg from '@yarnpkg/lockfile'

const { parse, stringify } = yarnpkg

export async function distillYarnV1Lockfile(
  lockfilePath: string,
  pkgJson: PackageJson,
  mode: Mode,
): Promise<string> {
  let lockfileStream: string
  try {
    lockfileStream = await readFile(lockfilePath, { encoding: 'utf8' })
  } catch {
    throw new Error(`Unable to read lockfile: "${lockfilePath}"`)
  }

  let lockfile
  try {
    lockfile = parse(lockfileStream) as YarnV1ParsedLockfile
  } catch {
    throw new Error('Unable to parse lockfile')
  }

  if (lockfile.type !== 'success') {
    throw new Error(
      `Lockfile not parsed successfully, with status "${lockfile.type}"`,
    )
  }

  const newLockfileDeps = Object.create(null) as YarnV1LockfileEntries
  const entriesToProcess =
    mode === 'full'
      ? [...Object.entries(pkgJson.dependencies ?? {})]
      : [
          ...Object.entries(pkgJson.dependencies ?? {}),
          ...Object.entries(pkgJson.devDependencies ?? {}),
        ]

  while (entriesToProcess.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [depName, depVersion] = entriesToProcess.pop()!
    const keyname = `${depName}@${depVersion}`

    // Updating the new lockfile
    const depDef = lockfile.object[keyname]
    if (depDef === undefined) {
      throw new Error(`Unable to find ${keyname} in lockfile`)
    }
    newLockfileDeps[keyname] = depDef

    // Adding more packages to the queue
    entriesToProcess.push(...Object.entries(depDef.dependencies ?? {}))
  }

  return stringify(newLockfileDeps)
}
