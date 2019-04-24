import {ImageProcessor} from "../ImageProcessor";
import gm from "gm";
import {Size} from "../../models/Size";
import {ResizeStrategy} from "../ResizeStrategy";
import path from "path";
import fs, {realpath} from "fs";
import {CacheGateway} from "../CacheGateway";
import {Stats} from "../Stats";

export class GraphicsMagic implements ImageProcessor
{
    private resourceId!: string;
    private fullPath!: string;
    private image!: gm.State;
    private readonly staticPath: string;
    private readonly resizeStrategy: ResizeStrategy;
    private cacheProvider: CacheGateway;
    private stats: Stats;

    public constructor(staticPath: string, resizeStrategy: ResizeStrategy, cacheProvider: CacheGateway, stats: Stats) {
        this.resizeStrategy = resizeStrategy;
        this.cacheProvider = cacheProvider;
        this.staticPath = staticPath;
        this.stats = stats;
    }

    async init(filePath: string): Promise<void> {
        this.resourceId = filePath;
        this.fullPath = await this.promiseGetResourcePath(filePath);
        const extension = path.extname(this.fullPath);
        if (['.jpg', '.jpeg', '.png'].indexOf(extension) == -1)
            throw new Error("File extension is not supported");
        this.image = gm(this.fullPath);
    }

    async getResized(requestedSize: Size): Promise<Buffer> {

        const originalSize = await this.promiseGetSize();
        const persistedSize = this.resizeStrategy.predictSize(originalSize, requestedSize);

        if (originalSize == persistedSize) {
            this.stats.incrementOriginalHit();
            return this.promiseGetBuffer();
        }

        let cachedFile: Buffer | null = null;
        try {
            const notOlderThan = (await fs.promises.stat(this.fullPath)).mtime;
            cachedFile = await this.cacheProvider.get(this.resourceId, persistedSize, notOlderThan);
        } catch (error) {
            this.stats.incrementCacheMiss();
        }

        if (cachedFile) {
            this.stats.incrementCacheHit()
            return await cachedFile;
        }

        this.image.resize(persistedSize.width, persistedSize.height, "!");
        const buffer = this.promiseGetBuffer();
        this.cacheProvider.set(this.resourceId, persistedSize, await buffer);
        return buffer;
    }

    public promiseGetSize(): Promise<Size> {
        return new Promise((resolve, reject) => {
            this.image.size((error, size) => {
                if (error) {
                    return reject(error);
                }
                return resolve(size);
            });
        });
    }

    public promiseGetFormat(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.image.format((error, format) => {
                if (error) reject(error);
                return resolve(format.toLowerCase());
            });
        });
    }

    async promiseGetResourcePath(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const fullPath = `${this.staticPath}/${path}`;
            realpath(fullPath, (error: Error, resolvedPath: string) => {
                if (error !== null) {
                    return reject(new Error(`File not found: ${fullPath}`));
                }
                if (!resolvedPath.startsWith(this.staticPath)) {
                    reject(`Path invalid: ${resolvedPath}`);
                }
                resolve(resolvedPath);
            });
        });
    }

    private promiseGetBuffer(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.image.toBuffer((error, buffer) => {
                if (error) return reject(error);
                return resolve(buffer);
            });
        });
    }
}