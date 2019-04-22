import {Size} from "./Size";

export interface ImageManipulator
{
    resize(requestedSize: Size): Promise <Buffer>;
    promiseGetSize(): Promise <Size>;
    promiseGetFormat(): Promise <string>;

    init(filePath: string): void;
}