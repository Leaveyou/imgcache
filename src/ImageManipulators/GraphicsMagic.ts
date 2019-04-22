import {ImageManipulator} from "../ImageManipulator";
import gm from "gm";
import {Size} from "../Size";
import {ResizeStrategy} from "../ResizeStrategy";
import path from "path";
import {realpath} from "fs";

export class GraphicsMagic implements ImageManipulator {
    private image!: gm.State;
    private fullPath!: string;
    private readonly staticPath: string;
    private readonly resizeStrategy: ResizeStrategy;

    public constructor(staticPath: string | undefined, resizeStrategy: ResizeStrategy) {
        this.resizeStrategy = resizeStrategy;
        if (staticPath == undefined) throw new Error("Please set `STATIC_PATH` environment variable");
        this.staticPath = staticPath;
    }

    private static validateExtension(filePath: string) {
        const extension = path.extname(filePath);
        if (['.jpg', '.jpeg', '.png'].indexOf(extension) == -1)
            throw new Error("File extension is not supported");
    }

    async init(filePath: string): Promise<void> {
        this.fullPath = await this.promiseGetResourcePath(filePath);
        GraphicsMagic.validateExtension(this.fullPath);
        this.image = gm(this.fullPath);
    }

    async resize(requestedSize: Size): Promise<Buffer> {
        const originalSize = await this.promiseGetSize();
        const predictedSize = this.resizeStrategy.getPredictedSize(originalSize, requestedSize);

        this.image.resize(predictedSize.width, predictedSize.height, "!");
        return await this.promiseGetBuffer();
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

    protected promiseGetBuffer(): Promise<Buffer> {
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