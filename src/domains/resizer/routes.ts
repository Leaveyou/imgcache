import {Router} from 'express';
import {serveFileController} from "./controllers/serveFileController";
import {logging as loggingMiddleware} from "./middlewares/logging";
import {security as securityMiddleware} from "./middlewares/security";

const routes = Router();

routes.use(loggingMiddleware);
routes.use(securityMiddleware);

const currentRoute = routes.route("/*");

currentRoute.get(serveFileController);

export default routes;
