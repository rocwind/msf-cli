import { promisify } from 'util';
import { resolve } from 'path';
import watchman from 'fb-watchman';
import chalk from 'chalk';
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
const exit = async () => {
    console.log(chalk.yellow('\ncleanup and exit ...'));
    const paths = Array.from(watchingPaths);
    for (const path of paths) {
        try {
            await command(['unsubscribe', path, path]);
            await command(['watch-del', path]);
        } catch (err) {
            const msg = err?.message;
            if (msg) {
                console.log(chalk.red(msg));
            }
        }
    }
    process.exit();
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
    // not sure about the reason, but it seems there are cases
    // 'watch-project' throws 'RootResolveError: unable to resolve root' exception
    // while 'watch' just works, so we use 'watch' here to avoid the exception
    // - although 'watch-project' is preffered to be used according to official doc
    await command(['watch', absPath]);
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
