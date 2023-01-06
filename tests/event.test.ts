import request from "supertest";
import createServer from "../utils/createServer";
import events from "./data/events.json";
import { connection, disconnect } from "../db/connection";
import { config } from "dotenv";
import { flushLastDocument } from "./hooks/flushLastDocument";
import Event from "../models/Event";
config();

beforeAll(() => connection(process.env.DB_URI));

afterAll(async () => {
  flushLastDocument(Event);
  disconnect();
});

const app = createServer();

describe("POST /event/create", () => {
  it("when jwt is verified and event data payload is correct, should create new event", async () => {
    const newEvent = await request(app)
      .post("/event/create")
      .set("Authorization", `Bearer ${process.env.AT}`)
      .send(events[0]);

    // event should exist
    const eventFromDb = await Event.findById(newEvent.body.event);

    expect(eventFromDb).toBeTruthy();
  });

  it("when jwt is verified and event data payload is incorrect, should return error message", async () => {
    const newEvent = await request(app)
      .post("/event/create")
      .set("Authorization", `Bearer ${process.env.AT}`)
      .send(events[1]);
  });

  it("when jwt is invalid, should return error message", async () => {
    const newEvent = await request(app)
      .post("/event/create")
      .set("Authorization", `Bearer ${process.env.INVALID_AT}`)
      .send(events[1]);

    expect(newEvent.text).toBe("jwt malformed");
  });

  it("when jwt has expired, should return error message", async () => {
    const newEvent = await request(app)
      .post("/event/create")
      .set("Authorization", `Bearer ${process.env.EXPIRED_AT}`)
      .send(events[1]);

    expect(newEvent.text).toBe("jwt expired");
  });
});

describe("GET /event", () => {
  it("when jwt correct, should return all user events", async () => {
    const events = await request(app)
      .get("/event")
      .set("Authorization", `Bearer ${process.env.AT}`);

    expect(events.body).toBeTruthy();
  });

  it("when jwt inccorrect, should return error message", async () => {
    const events = await request(app)
      .get("/event")
      .set("Authorization", `Bearer ${process.env.INVALID_AT}`);

    expect(events.text).toBe("jwt malformed");
  });

  it("when jwt expired, should return error message", async () => {
    const events = await request(app)
      .get("/event")
      .set("Authorization", `Bearer ${process.env.EXPIRED_AT}`);

    expect(events.text).toBe("jwt expired");
  });
});

describe("GET /event/:title", () => {
  it("when jwt correct, should return specific event of current user", async () => {
    const title = events[0].eventTitle;

    const event = await request(app)
      .get(`/event/${title}`)
      .set("Authorization", `Bearer ${process.env.AT}`);

    const eventFromDB = await Event.findById(event.body._id);

    expect(eventFromDB).toBeTruthy();
  });

  it("when jwt inccorrect, should return error message", async () => {
    const title = events[0].eventTitle;

    const event = await request(app)
      .get(`/event/${title}`)
      .set("Authorization", `Bearer ${process.env.INVALID_AT}`);

    expect(event.text).toBe("jwt malformed");
  });

  it("when jwt expired, should return error message", async () => {
    const title = events[0].eventTitle;

    const event = await request(app)
      .get(`/event/${title}`)
      .set("Authorization", `Bearer ${process.env.EXPIRED_AT}`);

    expect(event.text).toBe("jwt expired");
  });
});
