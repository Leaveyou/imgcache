import {Size} from "./Size";

export interface ResizeStrategy
{
    predictSize(originalSize: Size, requestedSize: Size): Size;
}