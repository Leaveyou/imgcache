import {Size} from "../models/Size";
import {Request, Response} from 'express';
import * as localisation from "../../../utils/localisation";
import * as config from "../../../config";
import {imageProcessor} from "../../../config";

/**
 * Ensure the size parameter is of correct format and reasonable size
 * @param request
 */
function parseSize(request: Request): { width: number, height: number } {
    const query = request.query;
    if (!query.size) {
        return config.MAX_SIZE;
    }
    const sizeString = query.size;
    const maximumPossibleLength = 1
    + config.MAX_SIZE.width.toString().length
    + config.MAX_SIZE.height.toString().length;
    if (sizeString.length > maximumPossibleLength) {
        throw new Error("Size parameter overflow attempt.");
    }
    const sizeTester = new RegExp('^([1-9]\\d*)x([1-9]\\d*)$');
    const isOK = sizeTester.exec(sizeString);
    if (!isOK) {
        throw new Error(`Requested image size incorrect: ${query.size}`);
    }
    const width = parseInt(isOK[1]);
    const height = parseInt(isOK[2]);
    if (width > config.MAX_SIZE.width || height > config.MAX_SIZE.height) {
        throw new Error("Format Wrong");
    }
    return {width: width, height: height};
}

export async function serveFileController(request: Request, response: Response) {
    const stats = config.stats;

    let requestedSize: Size;
    try {
        requestedSize = parseSize(request);
    } catch (error) {
        stats.incrementError();
        return response.status(400).send(
            localisation.incorrectSize
                .replace("%s", `${config.MAX_SIZE.width}x${config.MAX_SIZE.height}`));
    }
    const fileUri = decodeURI(request.path);
    try {
        await imageProcessor.init(fileUri);
    } catch (error) {
        stats.incrementNotFound();
        return response.status(404).send(localisation.cannotFindImage);
    }

    let resizedImage;
    try {
        resizedImage = await imageProcessor.getResized(requestedSize);
    } catch (error) {
        console.log(error);
    }

    let format = await imageProcessor.promiseGetFormat();
    response.contentType(`image/${format}`);

    return response.send(resizedImage);
}