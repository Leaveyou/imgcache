import {CacheProvider} from "../CacheProvider";
import fs from "fs";
import path from "path";
import {Size} from "../Size";

/**
 * Disk storage implementation of a cache provider.
 * ttl parameter is just a mock as this implementation does not support automatic expiry of resources
 */
export class DiskStorage implements CacheProvider {
    private readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    async get(name: string, size: Size, notOlderThan: Date): Promise<Buffer> {
        const fullPath = this.predictPath(name, size);
        const cacheMsTime = (await fs.promises.stat(fullPath)).mtime;
        if (cacheMsTime > notOlderThan) {
            return fs.promises.readFile(fullPath);
        }
        await fs.promises.unlink(fullPath);
        throw new Error("Cache was old. Deleted. Starting fresh. Plant a tree");
    }

    async set(name: string, size: Size, data: Buffer, ttl?: number): Promise <void> {
        const fullPath = this.predictPath(name, size);
        const directory = path.dirname(fullPath);

        await fs.promises.mkdir(directory, {recursive: true});
        await fs.promises.writeFile(fullPath, data);
    }

    private predictPath(cacheFileName: string, size: Size): string {
        const extension = path.extname(cacheFileName);
        return this.path + cacheFileName + "/" + size.width + "x" + size.height + extension;
    }
}