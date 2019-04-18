import * as config from "./utils/config";
import {realpath} from "fs";

export function validate(resolvedPath: string): boolean {
    return resolvedPath.startsWith(config.STATIC_PATH);

}

export function fileResolve(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const fullPath = config.STATIC_PATH + "/" + path;
        realpath(fullPath, function (error, resolvedPath) {
            if (error !== null) {
                reject(new Error("File not found: " + fullPath));
            } else {
                resolve(resolvedPath);
            }
        });
    });
}
