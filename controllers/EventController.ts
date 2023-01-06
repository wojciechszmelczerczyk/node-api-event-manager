import { Request, Response } from "express";
import Event from "../models/Event";

export const createEvent = async (req: Request, res: Response) => {
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
    res.json({ err: e.message });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  const { email } = req.user;

  const events = await Event.find({ email });

  res.json(events);
};

export const getEvent = async (req: Request, res: Response) => {
  const eventTitle = req.params.title;
  const email = req.user.email;
  const event = await Event.findOne({ eventTitle, email });

  res.json(event);
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = req.params.id;

  await Event.findByIdAndDelete(id);
  res.status(204);
};
