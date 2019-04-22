import {CacheProvider} from "../CacheProvider";

export class DiskStorage implements CacheProvider
{
    private path: string;

    constructor(path: string | undefined)
    {
        if (path == undefined) throw new Error("Please set `CACHE_PATH` environment variable");
        this.path = path;
    }
}