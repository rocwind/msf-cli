# msf-cli

msf(My Sync Folders) listens to changes between 2 folders and try to keep them in sync by copying changed files into the other folder. It's inspired by [wml](https://github.com/wix/wml) but different in following places:
- you don't need to create `links` first, msf just does its job on launch
- msf syncs folders in bi-direction

## Install
`npm install -g msf-cli`

## Usage
`msf ~/my-package ~/my-project/node_modules/my-package`
use `msf --help` to see all supported options

## Why
Symlinks are not supported in react-native currently, [check this thread](https://github.com/facebook/watchman/issues/105). Copy files is almost the only option to develop a shared package for RN project, the reason we want it bi-directional is sometimes, editing native code in RN project (xcode/Android studio) is more convenient to try things out and we want the edits can be synced back to source package.
