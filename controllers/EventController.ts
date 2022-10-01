import { Request, Response } from "express";
import Event from "../models/Event";

export const createEvent = async (req: any, res: Response) => {
  const { email, firstName, lastName } = req.user;

  const { eventTitle, startDate, endDate } = req.body;
  try {
    const event = await Event.create({
      email,
      firstName,
      lastName,
      eventTitle,
      startDate,
      endDate,
    });

    res.json({ event });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const getEvents = async (req: any, res: Response) => {
  const { email } = req.user;

  const events = await Event.find({ email });

  res.json(events);
};
