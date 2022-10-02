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
    required: [true, "Event title has to be provided"],
  },

  startDate: {
    type: Date,
    required: [true, "Event start date has to be provided"],
    validate: [validator.isDate, "data is no a valid date type"],
  },

  endDate: {
    type: Date,
    required: [true, "Event end date has to be provided"],
    validate: [validator.isDate, "data is no a valid date type"],
  },
});

const Event = model<IEvent>("event", eventSchema);

export default Event;
