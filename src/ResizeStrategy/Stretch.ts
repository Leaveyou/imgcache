import {IResizeStrategy} from "../IResizeStrategy";
import {ISize} from "../ISize";

export class Stretch implements IResizeStrategy
{
    getPredictedSize(originalSize: ISize, requestedSize: ISize): ISize
    {
        let predictedSize = requestedSize;
        if (predictedSize.width > originalSize.width) return originalSize;
        if (predictedSize.height > originalSize.height) return originalSize;

        return predictedSize;
    }
}