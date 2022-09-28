import express, { Application } from "express";
import { config } from "dotenv";
import userRouter from "./routes/user";
config();

const app: Application = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/user", userRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));
