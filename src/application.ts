import express from "express";
import staticResourcesStack from "./http/routes/staticResources";

const app: express.Application = express();
export default app;


app.use('/static/', staticResourcesStack);
