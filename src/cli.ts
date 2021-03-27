#! /usr/bin/env node
import { join } from 'path';
import yargs from 'yargs';
import { startWatch, Handler } from './client';
import { syncTo, rmFile } from './sync';

export const argv = yargs.usage('sync 2 folders in bi-direction').check((argv) => {
    if (argv._.length !== 2) {
        throw new Error('invalid command arguments');
    }
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
