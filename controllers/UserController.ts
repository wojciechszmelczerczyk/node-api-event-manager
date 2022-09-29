import { Request, Response } from "express";
import User from "../models/User";
import { createToken } from "../token/createToken";

export const register = async (
  req: Request<
    {},
    {},
    { firstName: string; lastName: string; email: string; password: string }
  >,
  res: Response
) => {
  try {
    // create new user in database
    const newUser = await User.create(req.body);

    // response with new user
    res.json(newUser);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const login = async (
  req: Request<
    {},
    {},
    { firstName: string; lastName: string; email: string; password: string }
  >,
  res: Response
) => {
  // intercept data from request
  const { email, password } = req.body;

  // find user by email, if exists decode hashed password and compare with one from request
  const { firstName, lastName } = await User.login(email, password);

  // if user exist, sign access token and refresh token

  const accessToken = createToken(
    {
      email,
      firstName,
      lastName,
    },
    process.env.AT_SECRET,
    "15m"
  );

  const refreshToken = createToken(
    {
      email,
      firstName,
      lastName,
    },
    process.env.RT_SECRET,
    "1y"
  );

  // response with new user
  res.json({ accessToken, refreshToken });
};
