# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.5](https://github.com/rocwind/msf-cli/compare/v1.2.4...v1.2.5) (2022-02-28)


### Bug Fixes

* **deps:** update dependency wait-ready to ^0.6.0 ([4aaab67](https://github.com/rocwind/msf-cli/commit/4aaab67a28924e892fd7dd13e7f475aef0c4a9f4))

### [1.2.4](https://github.com/rocwind/msf-cli/compare/v1.2.3...v1.2.4) (2021-12-24)


### Bug Fixes

* serialize calls to watchman to avoid issues ([54a2e3a](https://github.com/rocwind/msf-cli/commit/54a2e3a1a38cad7c5f9ccda5165a613cba751fa3))

### [1.2.3](https://github.com/rocwind/msf-cli/compare/v1.2.2...v1.2.3) (2021-08-18)


### Bug Fixes

* **deps:** update dependency fs-extra to v10 ([8846c04](https://github.com/rocwind/msf-cli/commit/8846c04de55a5b4d4b34d100682937ea854083e6))
* **deps:** update wait-ready and chalk ([e31d498](https://github.com/rocwind/msf-cli/commit/e31d498993aa4295f1d2d58c7ba277920686707d))
* **deps:** update yargs to v17 ([506a3c1](https://github.com/rocwind/msf-cli/commit/506a3c142a5334add94657cc4c46241678f8df3b))

### [1.2.2](https://github.com/rocwind/msf-cli/compare/v1.2.1...v1.2.2) (2021-07-12)


### Bug Fixes

* use watch but not watch-project command to workaround issues ([7d845bb](https://github.com/rocwind/msf-cli/commit/7d845bb6da7e913bc218011da1fa7a8f8dd6badb))

### [1.2.1](https://github.com/rocwind/msf-cli/compare/v1.2.0...v1.2.1) (2021-06-16)


### Bug Fixes

* msf cannot handle sub folder ignores with ignore file in working dir ([5451033](https://github.com/rocwind/msf-cli/commit/5451033c4a71e6da7d1efb2585fc53527652b6ef))
* msf should exit process even if cleanup failed ([2ca285c](https://github.com/rocwind/msf-cli/commit/2ca285c2ff17021e7609111ec17bf18fb8d5bd30))

## [1.2.0](https://github.com/rocwind/msf-cli/compare/v1.1.0...v1.2.0) (2021-05-20)


### Features

* search for .msfignore file by walking up parent directories of src ([04a5037](https://github.com/rocwind/msf-cli/commit/04a5037c8cab0d290782b607fcf8724229d4ab2e))

## [1.1.0](https://github.com/rocwind/msf-cli/compare/v1.0.0...v1.1.0) (2021-04-03)


### Features

* support using , in files option ([2084fc7](https://github.com/rocwind/msf-cli/commit/2084fc7601da4d08f3932fb267811bf9bfeb0999))


### Bug Fixes

* check of sync a folder to itself case and throw error ([417ec9b](https://github.com/rocwind/msf-cli/commit/417ec9b25315a6933999ae726c26c673f6db9411))

## [1.0.0](https://github.com/rocwind/msf-cli/compare/v0.0.1...v1.0.0) (2021-04-03)


### Features

* add color to logs ([5391e1f](https://github.com/rocwind/msf-cli/commit/5391e1fe8105b5fbc09c2a4e4608a3b591fc4981))
* support include/exclude sync files and sync modes ([d6ecd49](https://github.com/rocwind/msf-cli/commit/d6ecd49796fa7f0aa3efae08e78d7e07abcb3cbe))


### Bug Fixes

* ensure folders exsits first ([7a8264a](https://github.com/rocwind/msf-cli/commit/7a8264a9b583e862fee7cdfb913d49b379fdf87d))
* format the log and catch & ignore errors in cp/rm ([7b7c4b6](https://github.com/rocwind/msf-cli/commit/7b7c4b6c8177de8f019e38f56a1426bd26685110))
* skip rm changed file ([a608360](https://github.com/rocwind/msf-cli/commit/a60836052df87d0111896970446527587ffff417))

### 0.0.1 (2021-03-28)


### Features

* initial implementation of the cli ([2638bfa](https://github.com/rocwind/msf-cli/commit/2638bfa787506ad0d67ba836a1705aa850f76e07))
