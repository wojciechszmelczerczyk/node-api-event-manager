import { Request, Response } from "express";
import Event from "../models/Event";

export const createEvent = async (req: any, res: Response) => {
  const { email, firstName, lastName } = req.user;

  const eventDate = req.body.eventDate;

  const event = await Event.create({ email, firstName, lastName, eventDate });

  res.json({ event });
};
