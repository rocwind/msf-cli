import { dirname } from 'path';
import { copyFile, stat, utimes, rm, ensureDir } from 'fs-extra';
import { Logger } from './logger';

interface FileInfo {
    name: string;
    mtime?: number;
}
const getFileInfo = async (info: FileInfo): Promise<FileInfo> => {
    if (info.mtime) {
        return info;
    }
    try {
        const fileStat = await stat(info.name);
        return {
            ...info,
            mtime: Math.floor(fileStat.mtimeMs / 1000),
        };
    } catch (err) {
        return {
            ...info,
            mtime: 0,
        };
    }
};

export const syncTo = async (src: FileInfo, dest: FileInfo, logger: Logger): Promise<void> => {
    const [srcStat, destStat] = await Promise.all([getFileInfo(src), getFileInfo(dest)]);
    if (srcStat.mtime > destStat.mtime) {
        logger(`[cp] ${src.name} => ${dest.name}`);
        const parentDir = dirname(dest.name);
        await ensureDir(parentDir);
        await copyFile(src.name, dest.name);
        await utimes(destStat.name, srcStat.mtime, srcStat.mtime);
        return;
    }
    return;
};

export const rmFile = async (src: FileInfo, logger: Logger): Promise<void> => {
    logger(`[rm] ${src.name}`);
    await rm(src.name, () => {});
};
