import express from "express";
import resizer from "./domains/resizer/routes";
import helmet from "helmet";

const app: express.Application = express();

export default app;

app.use(helmet());

app.use('/static/', resizer);
