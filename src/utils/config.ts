import * as dotenv from "dotenv";
import {IResizeStrategy} from "../IResizeStrategy";
import {Fit} from "../ResizeStrategy/Fit";
import {Cover} from "../ResizeStrategy/Cover";
import {Stretch} from "../ResizeStrategy/Stretch";

let path = `${__dirname}/../../.env`;
dotenv.config({ path: path });

export const STATIC_PATH: string = process.env.STATIC_PATH;
export const CACHE_PATH: string = process.env.CACHE_PATH;
export const RESIZE_STRATEGY: IResizeStrategy = function getResizeStrategy(strategy: string) {
    console.log(strategy);
    switch (strategy) {
        case "FIT":return new Fit();
        case "COVER": return new Cover();
        case "STRETCH": return new Stretch();
        default: return new Stretch()
    }
}(process.env.RESIZE_STRATEGY);
