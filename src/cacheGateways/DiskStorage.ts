import {CacheProvider} from "../CacheProvider";
import {Size} from "../Size";
import fs from "fs";

export class DiskStorage implements CacheProvider
{
    set(name: never, data: Buffer, ttl: number): void {
    }
    private readonly path: string;

    constructor(path: string | undefined)
    {
        if (path == undefined) throw new Error("Please set `CACHE_PATH` environment variable");
        this.path = path;
    }

    async get(name: string, predictedSize: Size): Promise<Buffer> {
        return new Promise ( (resolve, reject) => {
            const path = this.predictPath(name, predictedSize);
            fs.readFile(path, (error, data) => {
                if (error) reject(error);
                resolve(data);
            });
        });
    }

    private predictPath(resourceId: string, predictedSize: Size): string
    {
        const cacheFileName = `${predictedSize.width}x${predictedSize.height}.cache`;
        return `${this.path + resourceId}/${cacheFileName}`;
    }

}