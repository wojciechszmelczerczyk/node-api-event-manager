import { sign } from "jsonwebtoken";

export const createToken = (payload, secret, expTime) =>
  sign(payload, secret, { expiresIn: expTime });
