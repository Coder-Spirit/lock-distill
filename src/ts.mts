export type Mode = 'full' | 'workspace'

export type DistillerOptions = {
  mode: Mode
  packageJson: string
  lockfile: string
  type: 'yarnv1'
  output?: string
}

export type YarnV1LockfileEntries = Record<
  string,
  { dependencies: Record<string, string> }
>

export type YarnV1ParsedLockfile =
  | { type: 'success'; object: YarnV1LockfileEntries }
  | { type: 'merge' | 'conflict'; object: unknown }
