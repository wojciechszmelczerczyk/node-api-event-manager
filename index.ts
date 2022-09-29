import { Application } from "express";
import { config } from "dotenv";
import createServer from "./utils/createServer";
import { connection } from "./db/connection";

config();

connection(process.env.DB_URI);

const app: Application = createServer();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
