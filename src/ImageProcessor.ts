import {Size} from "./Size";

export interface ImageProcessor {
    getResized(requestedSize: Size): Promise<Buffer>;

    promiseGetSize(): Promise<Size>;

    promiseGetFormat(): Promise<string>;

    init(filePath: string): void;
}