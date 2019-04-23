import express from "express";
import staticResourcesStack from "./http/routes/static";
import helmet from "helmet";

const app: express.Application = express();

export default app;

app.use(helmet());

app.use('/static/', staticResourcesStack);
