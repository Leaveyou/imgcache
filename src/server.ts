import express from "express";
import staticResources from "./resources";

const app: express.Application = express();

const router: express.Router = express.Router();

/**
 * @param {Request} request
 * @param {Response} response
 */
app.get('/static/*', staticResources);


// new staticResources(router);

const port = 8080;
app.listen(port, function () {
    console.log('Listening on port ' + port + '...');
});
