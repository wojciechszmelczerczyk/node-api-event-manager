import { Request, Response } from "express";
import User from "../models/User";
import { createToken } from "../token/createToken";

export const register = async (req: Request, res: Response) => {
  try {
    // create new user in database
    const newUser = await User.create(req.body);

    // response with new user
    res.json(newUser);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
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
      process.env.SECRET,
      "15m"
    );

    const refreshToken = createToken(
      {
        email,
        firstName,
        lastName,
      },
      process.env.SECRET,
      "1y"
    );

    // store refresh token in db
    await User.findOneAndUpdate({ email }, { refreshToken });

    // response with at and rt
    res.json({ accessToken, refreshToken });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName } = req.user;

    const accessToken = createToken(
      {
        email,
        firstName,
        lastName,
      },
      process.env.SECRET,
      "15m"
    );

    const refreshToken = createToken(
      {
        email,
        firstName,
        lastName,
      },
      process.env.SECRET,
      "1y"
    );

    // response with new at
    res.json({ accessToken, refreshToken });
  } catch (e) {
    res.status(400).send(e.message);
  }
};
