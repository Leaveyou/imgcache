import * as dotenv from "dotenv";
import {Fit} from "../resizeStrategy/Fit";
import {Cover} from "../resizeStrategy/Cover";
import {Stretch} from "../resizeStrategy/Stretch";
import {Size} from "../Size";
import {DiskStorage as DiskStorageCacheGateway} from "../cacheGateways/DiskStorage";
import {GraphicsMagic} from "../imageManipulators/GraphicsMagic";
import {ImageProcessor as ImageProcessorInterface} from "../ImageProcessor";
import {ResizeStrategy} from "../ResizeStrategy";

// todo: use a more "production friendly" solution
let path = `${__dirname}/../../.env`;
dotenv.config({path: path});



const getResizeStrategy = function (strategy: string): ResizeStrategy {
    switch (strategy) {
        case "FIT":
            return new Fit();
        case "COVER":
            return new Cover();
        case "STRETCH":
            return new Stretch();
        default:
            return new Stretch()
    }
};

export const imageProcessor: ImageProcessorInterface = new GraphicsMagic(
    process.env.STATIC_PATH,
    getResizeStrategy(process.env.RESIZE_STRATEGY ? process.env.RESIZE_STRATEGY : "STRETCH"),
    new DiskStorageCacheGateway(process.env.CACHE_PATH)
);

export const MAX_SIZE: Size = {width: 9999, height: 9999};