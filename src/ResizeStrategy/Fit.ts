import {IResizeStrategy} from "../IResizeStrategy";
import {ISize} from "../ISize";

export class Fit implements IResizeStrategy
{
    getPredictedSize(originalSize: ISize, requestedSize: ISize): ISize
    {
        const originalRatio = originalSize.width / originalSize.height;
        const requestedRatio = requestedSize.width / requestedSize.height;

        let predictedSize: ISize;

        if (originalRatio > requestedRatio) {
            predictedSize = {width: requestedSize.width, height: Math.round(requestedSize.width/originalRatio)}
        } else {
            predictedSize = {width: Math.round(requestedSize.height*originalRatio), height: requestedSize.height}
        }

        if (predictedSize.width > originalSize.width) return originalSize;
        if (predictedSize.height > originalSize.height) return originalSize;

        return predictedSize;
    }
}