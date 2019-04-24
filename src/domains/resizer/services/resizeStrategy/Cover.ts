import {ResizeStrategy} from "../ResizeStrategy";
import {Size} from "../../models/Size";

export class Cover implements ResizeStrategy
{
    predictSize(originalSize: Size, requestedSize: Size): Size {
        const originalRatio = originalSize.width / originalSize.height;
        const requestedRatio = requestedSize.width / requestedSize.height;

        let predictedSize;

        if (originalRatio > requestedRatio) {
            predictedSize = {width: Math.round(requestedSize.height*originalRatio), height: requestedSize.height}
        } else {
            predictedSize = {width: requestedSize.width, height: Math.round(requestedSize.width / originalRatio)};
        }

        if (predictedSize.width > originalSize.width) return originalSize;
        if (predictedSize.height > originalSize.height) return originalSize;

        return predictedSize;
    }
}