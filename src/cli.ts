#! /usr/bin/env node
import { join } from 'path';
import yargs from 'yargs';
import { existsSync } from 'fs-extra';
import { startWatch, Handler } from './client';
import { syncTo, rmFile } from './sync';

export const argv = yargs.usage('usage: msf source_folder target_folder').check((argv) => {
    if (argv._.length !== 2) {
        throw new Error('Error: invalid command arguments, msf can only sync between 2 folders');
    }
    argv._.forEach((path: string) => {
        const exists = existsSync(path);
        if (!exists) {
            throw new Error(`Error: ${path} is not exists`);
        }
    });

    return true;
}).argv;

const [src, dest] = argv._ as [string, string];

const getSubscriptionHandler = (source: string, target: string): Handler => {
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
            );
        } else {
            rmFile({
                name: join(target, info.name),
            });
        }
    };
};

startWatch(src, getSubscriptionHandler(src, dest));
startWatch(dest, getSubscriptionHandler(dest, src));
