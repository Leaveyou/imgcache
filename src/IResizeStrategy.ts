import {ISize} from "./ISize";

export interface IResizeStrategy
{
    getPredictedSize(originalSize: ISize, requestedSize: ISize): ISize;
}