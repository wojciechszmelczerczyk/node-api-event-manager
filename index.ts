import express, { Application } from "express";
import { config } from "dotenv";
import cors from "cors";
import userRouter from "./routes/user";
import { connection } from "./db/connection";
config();

connection(process.env.DB_URI);

const app: Application = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5000"],
    credentials: true,
  })
);

app.use("/user", userRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));
