import { model, Schema } from "mongoose";
import validator from "validator";

interface IEvent {
  firstName: string;
  lastName: string;
  email: string;
  eventTitle: String;
  startDate: Date;
  endDate: Date;
}

const eventSchema = new Schema<IEvent>({
  firstName: {
    type: String,
    required: [true, "Please enter a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter a last name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },

  eventTitle: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },
});

const Event = model<IEvent>("event", eventSchema);

export default Event;
