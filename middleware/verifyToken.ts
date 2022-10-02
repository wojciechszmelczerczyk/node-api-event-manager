import { NextFunction } from "express";
import { verify, decode } from "jsonwebtoken";
import { config } from "dotenv";
import { unless } from "express-unless";
config({ path: `${process.cwd()}/.env` });

const verifyToken = (req, res, next) => {
  try {
    // intercept auth headers
    let authHeader = req.headers["authorization"];

    // intercept at from header
    let token = authHeader && authHeader.split(" ")[1];

    // if token doesn't exist throw error
    if (token === undefined) throw new Error("Jwt doesn't exist");

    // otherwise check if token expired
    verify(token, process.env.SECRET, async (error, user) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          res.status(403).send(error.message);
        } else {
          res.status(403).send(error.message);
        }
      } else {
        // assign decoded payload to request object
        req.user = user;
        next();
      }
    });
  } catch (error) {
    res.status(403);
  }
};

verifyToken.unless = unless;

export default verifyToken;
