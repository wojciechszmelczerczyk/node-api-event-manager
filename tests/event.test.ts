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
    const eventExist = await Event.findById(newEvent.body.event);

    expect(eventExist).toBeTruthy();
  });

  it("when jwt is verified and event data payload is incorrect, should return error message", async () => {
    const newEvent = await request(app)
      .post("/event/create")
      .set("Authorization", `Bearer ${process.env.AT}`)
      .send(events[1]);

    expect(newEvent.error).toBeTruthy();
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
});
