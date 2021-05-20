#! /usr/bin/env node
import { join, resolve, parse, dirname, relative } from 'path';
import yargs from 'yargs';
import { cyan, green, red } from 'chalk';
import { existsSync, readFileSync, removeSync, ensureDirSync } from 'fs-extra';
import ignore, { Ignore } from 'ignore';
import { startWatch, Handler } from './client';
import { syncTo, rmFile } from './sync';
import { getLogger, Logger } from './logger';

export const argv = yargs
    .usage('usage: msf source_folder target_folder')
    .check((argv) => {
        if (argv._.length !== 2) {
            throw new Error(
                red('Error: invalid command arguments, msf can only sync between 2 folders'),
            );
        }
        const pathSet = new Set<string>();
        argv._.forEach((path: string) => {
            const absPath = resolve(path);
            if (pathSet.has(absPath)) {
                throw new Error(red(`Error: cannot sync a folder to itself ${path}`));
            }
            pathSet.add(absPath);
            const exists = existsSync(path);
            if (!exists) {
                throw new Error(red(`Error: ${path} is not exists`));
            }
        });

        return true;
    })
    .option('files', {
        alias: '-f',
        type: 'array',
        describe: 'syncs only files that matches given glob pattern',
    })
    .option('mode', {
        alias: '-m',
        choices: ['update-both', 'update', 'mirror'],
        describe: 'sync mode: bi-directional/uni-directional update between the 2 folders',
        default: 'update-both',
    }).argv;

const [src, dest] = argv._ as [string, string];

let includescMatcher: Ignore;
if (argv.files) {
    includescMatcher = ignore();
    argv.files.forEach((pattern: string) => {
        pattern.split(',').forEach((segment) => {
            includescMatcher.add(segment);
        });
    });
}

// deal with ignore files
let ignoresMatcher: Ignore;
// find up from src for ignoreFile
const ignoreFilename = '.msfignore';
const srcAbsPath = resolve(src);
const { root: srcRoot } = parse(srcAbsPath);
let directory = srcAbsPath;
let ignoreFile: string;
let ignoreFileRelative: string;
while (true) {
    const testFile = join(directory, ignoreFilename);
    if (existsSync(testFile)) {
        ignoreFileRelative = relative(directory, srcAbsPath) + '/';
        ignoreFile = testFile;
        break;
    }

    if (directory === srcRoot) {
        break;
    }

    directory = dirname(directory);
}

if (ignoreFile) {
    ignoresMatcher = ignore();

    readFileSync(ignoreFile)
        .toString()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => {
            // empty line
            if (!line) {
                return false;
            }
            // comments
            if (line.startsWith('#')) {
                return false;
            }

            // files in other dir
            if (
                ignoreFileRelative &&
                !(line[0] === '*') &&
                line.includes('/') &&
                !line.startsWith(ignoreFileRelative)
            ) {
                return false;
            }

            return true;
        })
        .map((line) => {
            // add ignore info by path relative to src
            if (ignoreFileRelative && line.startsWith(ignoreFileRelative)) {
                return relative(ignoreFileRelative, line);
            }
            return line;
        })
        .forEach((line) => {
            ignoresMatcher.add(line);
        });
}

const getSubscriptionHandler = (source: string, target: string, logger: Logger): Handler => {
    return (info) => {
        if (info.type !== 'f') {
            return;
        }
        // try includes
        if (includescMatcher && !includescMatcher.ignores(info.name)) {
            return;
        }
        // try ignores
        if (ignoresMatcher && ignoresMatcher.ignores(info.name)) {
            return;
        }

        if (info.exists) {
            syncTo(
                {
                    name: join(source, info.name),
                    mtime: info.mtime,
                },
                { name: join(target, info.name) },
                logger,
            );
        } else {
            rmFile(
                {
                    name: join(target, info.name),
                    mtime: info.mtime,
                },
                logger,
            );
        }
    };
};

// remove the target dir files first - TODO: should compare and do necessary removal for better performance
if (argv.mode === 'mirror') {
    removeSync(dest);
    ensureDirSync(dest);
}

const srcLogger = getLogger((text) => green(`=> ${text}`));
startWatch(src, getSubscriptionHandler(src, dest, srcLogger), srcLogger);

if (argv.mode === 'update-both') {
    const destLogger = getLogger((text) => cyan(`<= ${text}`));
    startWatch(dest, getSubscriptionHandler(dest, src, destLogger), destLogger);
}
