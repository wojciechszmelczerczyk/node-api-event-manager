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

  it("when jwt inccorrect, should return error message", async () => {
    const events = await request(app)
      .get("/event")
      .set("Authorization", `Bearer ${process.env.INVALID_AT}`);

    expect(events.error).toBeTruthy();
  });

  it("when jwt expired, should return error message", async () => {
    const events = await request(app)
      .get("/event")
      .set("Authorization", `Bearer ${process.env.EXPIRED_AT}`);

    expect(events.error).toBeTruthy();
  });
});

describe("GET /event/:title", () => {
  it("when jwt correct, should return specific event of current user", async () => {
    const title = events[0].eventTitle;

    const event = await request(app)
      .get(`/event/${title}`)
      .set("Authorization", `Bearer ${process.env.AT}`);

    const isExist = await Event.findById(event.body._id);

    expect(isExist).toBeTruthy();
  });

  it("when jwt inccorrect, should return error message", async () => {
    const title = events[0].eventTitle;

    const event = await request(app)
      .get(`/event/${title}`)
      .set("Authorization", `Bearer ${process.env.INVALID_AT}`);

    expect(event.error).toBeTruthy();
  });

  it("when jwt expired, should return error message", async () => {
    const title = events[0].eventTitle;

    const event = await request(app)
      .get(`/event/${title}`)
      .set("Authorization", `Bearer ${process.env.EXPIRED_AT}`);

    expect(event.error).toBeTruthy();
  });
});

describe("DELETE /event/:id", () => {
  it("when jwt correct and event with specified id exist, should delete event", async () => {
    // arbitary title
    const title = events[0].eventTitle;

    // find user by title
    const event = await request(app)
      .get(`/event/${title}`)
      .set("Authorization", `Bearer ${process.env.AT}`);

    const id = event.body._id;

    // use id from previous operation and delete event
    const res = await request(app)
      .delete(`/event/${id}`)
      .set("Authorization", `Bearer ${process.env.AT}`);

    // 204 status check
    expect(res.status).toBe(204);
  });
});
