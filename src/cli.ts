#! /usr/bin/env node
import { join } from 'path';
import yargs from 'yargs';
import { cyan, green, red } from 'chalk';
import { existsSync } from 'fs-extra';
import { startWatch, Handler } from './client';
import { syncTo, rmFile } from './sync';
import { getLogger, Logger } from './logger';

export const argv = yargs.usage('usage: msf source_folder target_folder').check((argv) => {
    if (argv._.length !== 2) {
        throw new Error(
            red('Error: invalid command arguments, msf can only sync between 2 folders'),
        );
    }
    argv._.forEach((path: string) => {
        const exists = existsSync(path);
        if (!exists) {
            throw new Error(red(`Error: ${path} is not exists`));
        }
    });

    return true;
}).argv;

const [src, dest] = argv._ as [string, string];

const getSubscriptionHandler = (source: string, target: string, logger: Logger): Handler => {
    return (info) => {
        if (info.type !== 'f') {
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
                },
                logger,
            );
        }
    };
};

const srcLogger = getLogger(green);
startWatch(src, getSubscriptionHandler(src, dest, srcLogger), srcLogger);

const destLogger = getLogger(cyan);
startWatch(dest, getSubscriptionHandler(dest, src, destLogger), destLogger);
