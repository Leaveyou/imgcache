import {Router} from 'express';
import {serveFileController} from "../controllers/serveFileController";
import {logging as loggingMiddleware} from "../middlewares/logging";
import {security as securityMiddleware} from "../middlewares/security";

const router = Router();

router.use(loggingMiddleware);
router.use(securityMiddleware);

const currentRoute = router.route("/*");

currentRoute.get(serveFileController);

export default router;
