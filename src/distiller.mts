import { Command, Option } from 'commander'
import { action } from './action.mjs'

const program = new Command()
  .name('lock-distiller')
  .description(
    'A lock-files distiller. It generates minimal lock-files for for specific workspaces in monorepo environments.',
  )
  .version('0.1.3')
  .requiredOption(
    '-p, --package-json <path>',
    'the workspace package.json must be specified',
  )
  .requiredOption(
    '-l, --lockfile <path>',
    'the base lockfile must be specified',
  )
  .option('-o, --output <path>', 'output file path')
  .addOption(
    new Option(
      '-m, --mode <mode>',
      'specify how do you want to distill the lockfile',
    )
      .choices(['full', 'workspace'])
      .default('full'),
  )
  .addOption(
    new Option('-t, --type <type>').choices(['yarnv1']).default('yarnv1'),
  )
  .action(action)

try {
  await program.parseAsync()
} catch (error) {
  if (error instanceof Error && error?.message) {
    console.error(`Error: ${error.message}`)
  } else {
    console.error('Unknown error')
  }
  process.exitCode = 1
}
