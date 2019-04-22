import {ResizeStrategy} from "../ResizeStrategy";
import {Size} from "../Size";

export class Stretch implements ResizeStrategy
{
    predictSize(originalSize: Size, requestedSize: Size): Size
    {
        let predictedSize = requestedSize;
        if (predictedSize.width > originalSize.width) return originalSize;
        if (predictedSize.height > originalSize.height) return originalSize;

        return predictedSize;
    }
}