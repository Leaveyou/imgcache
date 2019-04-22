import {Size} from "./Size";

export interface ResizeStrategy
{
    getPredictedSize(originalSize: Size, requestedSize: Size): Size;
}