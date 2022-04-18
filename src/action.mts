import { readFile, writeFile } from 'node:fs/promises'
import { type DistillerOptions } from './ts.mjs'
import { type PackageJson } from 'type-fest'
import { distillYarnV1Lockfile } from './yarnv1.mjs'

export async function action(options: DistillerOptions): Promise<void> {
  let pkgJsonStream: string
  try {
    pkgJsonStream = await readFile(options.packageJson, { encoding: 'utf8' })
  } catch {
    throw new Error(
      `Unable to read package.json file: "${options.packageJson}"`,
    )
  }

  let pkgJson: PackageJson
  try {
    pkgJson = JSON.parse(pkgJsonStream) as PackageJson
  } catch {
    throw new Error('Unable to parse package.json file')
  }

  const distilledLockfileContent =
    options.type === 'yarnv1'
      ? await distillYarnV1Lockfile(options.lockfile, pkgJson, options.mode)
      : (() => {
          throw new Error('Invalid lockfile type')
        })()

  if (options.output === undefined) {
    process.stdout.write(distilledLockfileContent)
  } else {
    await writeFile(options.output, distilledLockfileContent, {
      encoding: 'utf8',
    })
  }
}
