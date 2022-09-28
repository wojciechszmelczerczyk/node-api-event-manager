import { Request, Response } from "express";
import User from "../models/User";

export const register = async (
  req: Request<
    {},
    {},
    { firstName: string; lastName: string; email: string; password: string }
  >,
  res: Response
) => {
  // create new user in database
  const newUser = await User.create(req.body);

  // response with new user
  res.json(newUser);
};
