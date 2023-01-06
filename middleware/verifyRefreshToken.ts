import { verify } from "jsonwebtoken";
import { config } from "dotenv";
config({ path: `${process.cwd()}/.env` });

const verifyRefreshToken = (req, res, next) => {
  try {
    // intercept auth headers
    let authHeader = req.headers["authorization"];

    // intercept at from header
    let token = authHeader && authHeader.split(" ")[1];

    // if token doesn't exist throw error
    if (token === undefined) throw new Error("Jwt doesn't exist");

    // otherwise check if token expired
    verify(token, process.env.RT_SECRET, async (error, user) => {
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

export default verifyRefreshToken;
