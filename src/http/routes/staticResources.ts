import {Request, Response, Router} from 'express';
import {fileResolve, validate} from "../../FileResolver";
import {JpegHandler} from "../../fileHandlers/JpegHandler";
import {HandlerCollection} from "../../HandlerCollection";
import {IFormatHandler} from "../../IFormatHandler";
import {Resource} from "../../Resource";
import {PngHandler} from "../../fileHandlers/PngHandler";
import * as localisation from "../../utils/localisation";
import * as config from "../../utils/config";
import serveStatic from 'serve-static';
import path from 'path';
import gm from 'gm';
import fs from 'fs';

const router = Router();

const currentRoute = router.route("/*");


// Logging middleware
router.use( (request, response, next) => {
    console.log("aaaaaaaa");
    next();
});

// static handler
router.use( serveStatic(path.join(__dirname,  '..', '..', '..', 'static')));

/**
 * Promisify gm getSize
 * @param imageObject
 */
function getSize(imageObject)
{
    return new Promise((resolve, reject) => {
        imageObject.size((error, size) => {
            if (error) {
                return reject(error);
            }
            return resolve(size);
        });
    });
}

/**
 * Ensure the size parameter is of correct format and reasonable size
 * @param sizeString
 */
function parseSize(sizeString: string)
{
    if (sizeString.length > 10) {
        throw new Error("Size parameter overflow attempt.");
    }
    const sizeTester = new RegExp('^[1-9]\\d*x[1-9]\\d*$');
    const isOK = sizeTester.test(sizeString);
    if (!isOK) {
        throw new Error("Size parameter format incorrect: " + query.size );
    }
    const size = sizeString.split("x");
    const width = parseInt(size[0]);
    const height = parseInt(size[1]);
    if (width > 9999 || width > 9999) {
        throw new Error("Format Wrong");
    }
    return {width: width, height: height};
}

currentRoute.get(async (request: Request, response: Response, next) => {
    const query = request.query;
    if (!query.size) {
        return next();
    }

    try {
        const requestedSize = parseSize(query.size);
    } catch (error) {
        // todo: log error
        console.log(error);
        return response.status(404).send(localisation.incorrectSize);
    }


    const fileUri = request.path;
    const resource = await getResource(fileUri);
    let originalImage = gm(resource.filePath);

    try {
        const originalSize = await getSize(originalImage);
    } catch (error) {
        // todo: log error
        console.log(error);
        return response.status(404).send(localisation.cannotFindImage)
    }

// config.RESIZE_STRATEGY;

console.log(config.RESIZE_STRATEGY);

    originalImage.resize(requestedSize.width, requestedSize.height, config.RESIZE_STRATEGY.getResizeFlags());

    originalImage.toBuffer( (error, buffer) => {
        originalImage.format((error, format) => {
            response.contentType("image/" + format.toLowerCase());
            response.send(buffer);
            return;
        });

    });


    const cacheFile = config.CACHE_PATH + fileUri;
    const baseName = path.dirname(cacheFile);

    fs.mkdir(cacheFile + "/width_x.jpg", {recursive: true}, (error) => {
        if (error) {return console.log(error);}
        originalImage.write(cacheFile, function (err) {
            if (!err) console.log('done');
            else console.log(err);
        });
    });




    // get original file path
    // get dimensions
    // get resize algorithm
    // calculate resized dimensions
    // determine cache file name (only save width: say width_1024.jpg)
    // check for cache file
        // yes:
            // validate cache file age ( should regenerate? )
                // no: serve cache file
                // yes: regenerate
        // no: regenerate

 //   response.send("  ");
    // serveResized();
});


async function getResource(fileUri): Promise <Resource>
{
    const resolvedPath = await fileResolve(fileUri);
    const valid = validate(resolvedPath);
    if (!valid) {
        throw new Error("Path not valid:" + resolvedPath);
    }

    let jpegHandler = new JpegHandler();
    let pngHandler = new PngHandler();

    let handlerCollection = new HandlerCollection();
    handlerCollection.registerFileFormatHandler(jpegHandler, 'jpg');
    handlerCollection.registerFileFormatHandler(jpegHandler, 'jpeg');
    handlerCollection.registerFileFormatHandler(pngHandler, 'png');

    const handler: IFormatHandler = handlerCollection.getHandlerForFile(resolvedPath);
    return new Resource(fileUri, resolvedPath, handler);
}



export default router;
