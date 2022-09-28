import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const register = (
  req: Request<
    {},
    {},
    { firstName: string; lastName: string; email: string; password: string }
  >,
  res: Response
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  res.json(req.body);
};
