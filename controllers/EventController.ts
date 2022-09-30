import { Request, Response } from "express";
import Event from "../models/Event";

export const createEvent = async (req: any, res: Response) => {
  const { email, firstName, lastName } = req.user;

  const { eventTitle, eventDate } = req.body;

  const event = await Event.create({
    email,
    firstName,
    lastName,
    eventTitle,
    eventDate,
  });

  res.json({ event });
};

export const getEvents = async (req: any, res: Response) => {
  const { email } = req.user;

  const events = await Event.find({ email });

  res.json(events);
};
