import * as dotenv from "dotenv";

let path = `${__dirname}/../../.env`;
dotenv.config({ path: path });

export const STATIC_PATH: string = process.env.STATIC_PATH;
