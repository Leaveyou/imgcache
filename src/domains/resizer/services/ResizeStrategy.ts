import {Size} from "../models/Size";

export interface ResizeStrategy
{
    predictSize(originalSize: Size, requestedSize: Size): Size;
}