import { promisify } from 'util';
import { resolve } from 'path';
import watchman from 'fb-watchman';
import { yellow } from 'chalk';
import { wait } from 'wait-ready';
import { Logger } from './logger';

const client = new watchman.Client();

const capabilityCheck = promisify(client.capabilityCheck.bind(client));
const command = promisify(client.command.bind(client));

// do init with capability check
const { afterReady, setReady } = wait();
capabilityCheck({ required: ['relative_root'] }).then((resp: unknown) => {
    setReady(resp);
});

const watchingPaths = new Set<string>();

// exit process
const exit = () => {
    console.log(yellow('\ncleanup and exit ...'));
    Promise.all(
        Array.from(watchingPaths).map((path) => {
            return command(['unsubscribe', path, path]).then(() => {
                command(['watch-del', path]);
            });
        }),
    ).then(() => {
        process.exit();
    });
};

process.on('SIGINT', () => {
    exit();
});

process.on('SIGTERM', () => {
    exit();
});

interface SubscriptionFileInfo {
    name: string;
    exists: boolean;
    type: 'f' | 'd';
    mtime: number;
}
export type Handler = (info: SubscriptionFileInfo) => void;
const handlerBySubscription = new Map<string, Handler>();

client.on('subscription', (resp: { subscription: string; files: SubscriptionFileInfo[] }) => {
    const { subscription, files } = resp;
    const handler = handlerBySubscription.get(subscription);
    for (let file of files) {
        handler(file);
    }
});

export const startWatch = async (path: string, handler: Handler, logger: Logger): Promise<void> => {
    const absPath = resolve(path);

    handlerBySubscription.set(absPath, handler);

    // check if already watched
    if (watchingPaths.has(absPath)) {
        return Promise.resolve();
    }

    watchingPaths.add(absPath);
    await afterReady();
    logger(`start watching ${absPath} ...`);
    await command(['watch-project', absPath]);
    // subscrbie changes
    await command([
        'subscribe',
        absPath,
        absPath,
        {
            expression: ['allof', ['match', '*']],
            fields: ['name', 'mtime', 'exists', 'type'],
        },
    ]);
};
