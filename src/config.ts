import {Fit} from "./domains/resizer/services/resizeStrategy/Fit";
import {Cover} from "./domains/resizer/services/resizeStrategy/Cover";
import {Stretch} from "./domains/resizer/services/resizeStrategy/Stretch";
import {Size} from "./domains/resizer/models/Size";
import {DiskStorage as DiskStorageCacheGateway} from "./domains/resizer/services/cacheGateways/DiskStorage";
import {GraphicsMagic} from "./domains/resizer/services/imageProcessors/GraphicsMagic";
import {ImageProcessor as ImageProcessorInterface} from "./domains/resizer/services/ImageProcessor";
import {ResizeStrategy} from "./domains/resizer/services/ResizeStrategy";
import {Stats} from "./domains/resizer/services/Stats";

const getResizeStrategy = (strategy: string): ResizeStrategy => {
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

if (!process.env.PORT) throw new Error("Please set `PORT` environment variable");
if (!process.env.CACHE_PATH) throw new Error("Please set `CACHE_PATH` environment variable");
if (!process.env.STATIC_PATH) throw new Error("Please set `STATIC_PATH` environment variable");

export const stats: Stats = new Stats(process.env.STATSD_HOST, process.env.STATSD_PORT);

export const imageProcessor: ImageProcessorInterface = new GraphicsMagic(
    process.env.STATIC_PATH,
    getResizeStrategy(process.env.RESIZE_STRATEGY ? process.env.RESIZE_STRATEGY : "STRETCH"),
    new DiskStorageCacheGateway(process.env.CACHE_PATH),
    stats
);


export const MAX_SIZE: Size = {width: 9999, height: 9999};
export const PORT: number = parseInt(process.env.PORT);