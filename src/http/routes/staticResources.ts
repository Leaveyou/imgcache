import {Request, Response, Router} from 'express';
import {getResourcePath} from "../../FileResolver";
import {Resource} from "../../Resource";
import * as localisation from "../../utils/localisation";
import * as config from "../../utils/config";
import gm from 'gm';
import path from "path";
import {ISize} from "../../ISize";

const router = Router();

const currentRoute = router.route("/*");

// Logging middleware
router.use( (request, response, next) => {
    console.log("aaaaaaaa");
    next();
});


/**
 * Ensure the size parameter is of correct format and reasonable size
 * @param request
 */
function parseSize(request: Request): {width: number, height: number}
{
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
        throw new Error(`Requested image size incorrect: ${query.size}` );
    }

    const width = parseInt(isOK[1]);
    const height = parseInt(isOK[2]);

    if (width > config.MAX_SIZE.width || height > config.MAX_SIZE.height) {
        throw new Error("Format Wrong");
    }
    return {width: width, height: height};
}

currentRoute.get(async (request: Request, response: Response, next) => {
    let requestedSize: ISize;
    try {
        requestedSize = parseSize(request);
    } catch (error) {
        return response.status(400).send(
            localisation.incorrectSize
                .replace("%s", `${config.MAX_SIZE.width}x${config.MAX_SIZE.height}`));
    }

    const fileUri = request.path;

    let resource: Resource;
    try {
        resource = await getResource(fileUri);
    } catch (error) {
        return response.status(404).send(localisation.cannotFindImage);
    }

    let resizedImage = await resource.getResizedImageContents(requestedSize, config.RESIZE_STRATEGY);
    let format = await resource.getImageFormat();
    console.log(format);
    response.contentType(`image/${format.toLowerCase()}`);
    return response.send(resizedImage);
});


async function getResource(resourceId: string): Promise <Resource>
{
    const resolvedPath = await getResourcePath(resourceId);
    const extension = path.extname(resolvedPath);

    if (config.EXTENSIONS_SUPPORTED.indexOf(extension) == -1) {
        throw new Error(`Extension not supported: ${extension}`);
    }
    let imageState = gm(resolvedPath);
    return new Resource(resourceId, resolvedPath, imageState);
}



export default router;
