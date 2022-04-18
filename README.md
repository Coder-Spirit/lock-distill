# Lock-Distill

[![NPM version](https://img.shields.io/npm/v/@coderspirit/lock-distill.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/lock-distill)
[![TypeScript](https://badgen.net/npm/types/@coderspirit/lock-distill)](http://www.typescriptlang.org/)
[![License](https://badgen.net/npm/license/@coderspirit/lock-distill)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/@coderspirit/lock-distill.svg?style=flat)](https://www.npmjs.com/package/@coderspirit/lock-distill)
[![Known Vulnerabilities](https://snyk.io//test/github/Coder-Spirit/lock-distill/badge.svg?targetFile=package.json)](https://snyk.io//test/github/Coder-Spirit/lock-distill?targetFile=package.json)
[![Security Score](https://snyk-widget.herokuapp.com/badge/npm/@coderspirit%2Flock-distill/badge.svg)](https://snyk.io/advisor/npm-package/@coderspirit/lock-distill)

## Introduction

Lock-Distill is a tool designed to create "minimal" lockfiles to be used when
building OCI/Docker images, in the context of monorepos.

When working on monorepo environments, it is typical to rely on tools such as
"yarn workspaces". This has some advantages, but it also presents some problems.

A very insidious problem is that a unique and global lockfile is shared between
all the workspaces inside the monorepo. This has the unfortunate consequence
that this lockfile will change with much higher frequency than if we had one
repository per workspace.

The higher changes frequency implies that Docker Builder (or any other OCI image
builders) will have to discard the cached layers based on that file more often,
therefore having to spend more time and energy recomputing previously done work.

## Install instructions

```
# With NPM
npm install @coderspirit/lock-distill

# Or with Yarn:
yarn add @coderspirit/lock-distill
```

## Usage

We have to pass at least two options:
- The application `package.json` file path
- The file path for the global lockfile

```bash
lock-distill -p ./apps/svc1/package.json -l ./yarn.lock -o ./apps/svc1/distilled.yarn.lock
```

### Options

- `-p, --package <path>`: The application's `package.json` file path.
  **Required**.
- `-l, --lockfile <path>`: The monorepo's global lockfile path. **Required**.
- `-o, --output <path>`: The path where to write the distillation output. If not
  passed, then the result can be directly read from stdout.
- `-m, --mode <full|workspace>`: It specifies how aggressive will be the
  distillation process.
  - If set to `workspace`, then it will generate a new lockfile containing
    references to the workspace's prod & dev dependencies.
  - If set to `full`, then it will generate a new lockfile only containing
    references to the workspace's prod dependencies. This is the default option.
- `-t, --type`: This option is not useful yet, as only Yarn v1.x is supported
  for now, but hopefully we'll introduce support for Yarn >=2, PNPM and others.
