# msf-cli

msf(My Sync Folders) listens to changes between 2 folders and try to keep them in sync by copying changed files into the other folder. It's inspired by [wml](https://github.com/wix/wml) but different in following places:
- you don't need to create `links` first, msf just does its job on launch
- msf syncs folders in bi-direction

## Install
msf depends on [watchman](https://facebook.github.io/watchman/) to monitor file changes, please [install watchman](https://facebook.github.io/watchman/docs/install.html) first.

`npm install -g msf-cli`

## Usage
`msf ~/my-package ~/my-project/node_modules/my-package`
use `msf --help` to see all supported options

### .msfignore
a `.msfignore` file under source folder, follows `.gitignore` syntax can help to ignore files from being synced.
since msf is based on [watchman](https://facebook.github.io/watchman/), a `.watchmanconfig` with below example contents can also help to ignore files:
```
{
  "ignore_dirs": ["node_modules"]
}
```

## Why
Symlinks are not supported in react-native currently, [check this thread](https://github.com/facebook/watchman/issues/105). Copy files is almost the only option to develop a shared package for RN project, the reason we want it bi-directional is sometimes, editing native code in RN project (xcode/Android studio) is more convenient to try things out and we want the edits can be synced back to source package.
