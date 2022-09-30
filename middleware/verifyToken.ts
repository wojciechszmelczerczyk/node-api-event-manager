import { NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { config } from "dotenv";
import { unless } from "express-unless";
config({ path: `${process.cwd()}/.env` });

const verifyToken = (req, res, next) => {
  try {
    // intercept auth headers
    let authHeader = req.headers["authorization"];

    // intercept at from header
    let at = authHeader && authHeader.split(" ")[1];

    // if token doesn't exist throw error
    if (at === undefined) throw new Error("Jwt doesn't exist");

    // otherwise check if token expired
    verify(at, process.env.AT_SECRET, async (error, user) => {
      if (error) {
        console.log(error.message);
        if (error.name === "TokenExpiredError") {
          res.status(403);
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
