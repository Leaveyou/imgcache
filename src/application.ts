import express from "express";
import staticResourcesStack from "./http/routes/static";

const app: express.Application = express();
export default app;

app.use('/static/', staticResourcesStack);
