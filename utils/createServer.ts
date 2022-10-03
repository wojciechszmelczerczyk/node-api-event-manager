import userRouter from "../routes/user";
import eventRouter from "../routes/event";

import cors from "cors";
import express, { Application } from "express";
import verifyToken from "../middleware/verifyToken";

const createServer = (): Application => {
  const app: Application = express();

  app.use(express.json());

  app.use(
    cors({
      origin: ["http://localhost:5000", "http://192.168.0.107:5000"],
      credentials: true,
    })
  );

  app.use(
    verifyToken.unless({
      path: [{ url: "/user", method: "POST" }, "/user/authenticate"],
    })
  );

  app.use("/user", userRouter);
  app.use("/event", eventRouter);

  return app;
};

export default createServer;
