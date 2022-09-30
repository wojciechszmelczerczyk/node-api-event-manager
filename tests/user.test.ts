import request from "supertest";
import createServer from "../utils/createServer";
import users from "./data/users.json";
import { connection, disconnect } from "../db/connection";
import { config } from "dotenv";
import { flushLastDocument } from "./hooks/flushLastDocument";
import User from "../models/User";
config();

beforeAll(() => connection(process.env.DB_URI));

afterAll(async () => {
  flushLastDocument(User);
  disconnect();
});

const app = createServer();

describe("POST /user", () => {
  it.only("when all credentials correct, should create user", async () => {
    const newUser = await request(app).post("/user").send(users[0]);

    // find created user in database
    const userFromDb = await User.findById(newUser.body._id);

    // if user credentials are correct, shouldn't be any error response back
    expect(newUser.error).not.toBeTruthy();

    // user should exist
    expect(userFromDb).toBeTruthy();
  });

  it("when email doesn't match email regex, should return an error message", async () => {
    const errData = await request(app).post("/user").send(users[1]);
    expect(errData.error).toBeTruthy();
    expect(errData.text).toBe(
      "user validation failed: email: Please enter a valid email"
    );
  });

  it("when no email provided, should return an error message", async () => {
    const errData = await request(app).post("/user").send(users[2]);
    expect(errData.error).toBeTruthy();
    expect(errData.text).toBe(
      "user validation failed: email: Please enter an email"
    );
  });

  it("when provided password is shorter than 6, should return an error message", async () => {
    const errData = await request(app).post("/user").send(users[3]);
    expect(errData.error).toBeTruthy();
    expect(errData.text).toBe(
      "user validation failed: password: Password is too short. Minimum length is 6 characters"
    );
  });
});
