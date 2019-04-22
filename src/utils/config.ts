import * as dotenv from "dotenv";
import {Fit} from "../ResizeStrategy/Fit";
import {Cover} from "../ResizeStrategy/Cover";
import {Stretch} from "../ResizeStrategy/Stretch";
import {Size} from "../Size";
import {CacheProvider} from "../CacheProvider";
import {DiskStorage as DiskStorageCacheGateway} from "../CacheGateways/DiskStorage";
import {GraphicsMagic} from "../ImageManipulators/GraphicsMagic";
import {ImageManipulator as ImageManipulatorInterface} from "../ImageManipulator";
import {ResizeStrategy} from "../ResizeStrategy";


// todo: use a more "production friendly" solution
let path = `${__dirname}/../../.env`;
dotenv.config({path: path});

export const CACHE_GATEWAY: CacheProvider = new DiskStorageCacheGateway(process.env.CACHE_PATH);

export const MAX_SIZE: Size = {width: 9999, height: 9999};

export const resource: ImageManipulatorInterface = new GraphicsMagic(
    process.env.STATIC_PATH,
    function (strategy: string): ResizeStrategy {
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
    }(process.env.RESIZE_STRATEGY ? process.env.RESIZE_STRATEGY : "STRETCH"));
