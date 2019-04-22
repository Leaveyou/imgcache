import {ImageProcessor} from "../ImageProcessor";
import gm from "gm";
import {Size} from "../Size";
import {ResizeStrategy} from "../ResizeStrategy";
import path from "path";
import {realpath} from "fs";
import {CacheProvider} from "../CacheProvider";

export class GraphicsMagic implements ImageProcessor {
    private resourceId: string;
    private fullPath!: string;
    private image!: gm.State;
    private readonly staticPath: string;
    private readonly resizeStrategy: ResizeStrategy;
    private cacheProvider: CacheProvider;

    public constructor(staticPath: string | undefined, resizeStrategy: ResizeStrategy, cacheProvider: CacheProvider) {
        this.resizeStrategy = resizeStrategy;
        this.cacheProvider = cacheProvider;
        if (staticPath == undefined) throw new Error("Please set `STATIC_PATH` environment variable");
        this.staticPath = staticPath;
    }

    private static validateExtension(filePath: string) {
        const extension = path.extname(filePath);
        if (['.jpg', '.jpeg', '.png'].indexOf(extension) == -1)
            throw new Error("File extension is not supported");
    }

    async init(filePath: string): Promise<void> {
        this.resourceId = filePath;
        this.fullPath = await this.promiseGetResourcePath(filePath);
        GraphicsMagic.validateExtension(this.fullPath);
        this.image = gm(this.fullPath);
    }

    async getResized(requestedSize: Size): Promise<Buffer> {
        const originalSize = await this.promiseGetSize();
        const predictedSize = this.resizeStrategy.getPredictedSize(originalSize, requestedSize);

        let cachedFile = null;
        try {
            cachedFile = await this.cacheProvider.get(this.resourceId, predictedSize);
        } catch (error) {
            // todo: cache failed. log
        }

        if (cachedFile) {
            return cachedFile;
        }


        this.image.resize(predictedSize.width, predictedSize.height, "!");
        const buffer = await this.promiseGetBuffer();

        this.cacheProvider.set(name, ttl)

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
                return resolve(format);
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
}