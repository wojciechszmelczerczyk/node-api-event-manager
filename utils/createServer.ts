import userRouter from "../routes/user";
import cors from "cors";
import express, { Application } from "express";

const createServer = (): Application => {
  const app: Application = express();

  app.use(express.json());

  app.use(
    cors({
      origin: ["http://localhost:5000"],
      credentials: true,
    })
  );

  app.use("/user", userRouter);

  return app;
};

export default createServer;
