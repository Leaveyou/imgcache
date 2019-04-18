import {Request, Response, Router} from 'express';
import {fileResolve, validate} from "../../FileResolver";
import {JpegHandler} from "../../fileHandlers/JpegHandler";
import {HandlerCollection} from "../../HandlerCollection";
import {IFormatHandler} from "../../IFormatHandler";
import {Resource} from "../../Resource";
import {PngHandler} from "../../fileHandlers/PngHandler";
import * as localisation from "../../utils/localisation";
import serveStatic from 'serve-static';
import path from 'path';

const router = Router();

const currentRoute = router.route("/*");


// Logging middleware
router.use( (request, response, next) => {
    console.log("aaaaaaaa");
    next();
});

// static handler
router.use( serveStatic(path.join(__dirname,  '..', '..', '..', 'static')));


currentRoute.get((request: Request, response: Response, next) => {
    const query = request.query;
    if (!query.size) {
        return next();
    }
    // todo: validate query

    if (!query.size) {
        response.status(404).send(localisation.incorrectSize);
    }

    serveResized();
});

async function getResource(fileUri, response: e.Response)
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
    const resource = new Resource(fileUri, resolvedPath, handler);
}



export default router;
