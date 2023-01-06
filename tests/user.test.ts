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
  it("when all credentials correct, should create user", async () => {
    const newUser = await request(app).post("/user").send(users[0]);

    // find created user in database
    const userFromDb = await User.findById(newUser.body._id);

    // if user credentials are correct, shouldn't be any error response back
    expect(newUser.error).toBeFalsy();

    // user should exist
    expect(userFromDb).toBeTruthy();
  });

  it("when email doesn't match email regex, should return an error message", async () => {
    const errData = await request(app).post("/user").send(users[1]);
    expect(errData.body.err).toBe(
      "user validation failed: email: Please enter a valid email"
    );
  });

  it("when no email provided, should return an error message", async () => {
    const errData = await request(app).post("/user").send(users[2]);
    expect(errData.body.err).toBe(
      "user validation failed: email: Please enter an email"
    );
  });

  it("when provided password is shorter than 6, should return an error message", async () => {
    const errData = await request(app).post("/user").send(users[3]);
    expect(errData.body.err).toBe(
      "user validation failed: password: Password is too short. Minimum length is 6 characters"
    );
  });
});

describe("POST /user/authenticate", () => {
  it("when provided user credentials match with user from db, should return access token and refresh token", async () => {
    const { body } = await request(app)
      .post("/user/authenticate")
      .send(users[0]);
    expect(body.accessToken && body.refreshToken).toBeTruthy();
  });

  it("when email doesn't match email regex, should return an error message", async () => {
    const errData = await request(app)
      .post("/user/authenticate")
      .send(users[1]);

    expect(errData.body.err).toBe(
      "Provide correct email. User with this email doesn't exist"
    );
  });

  it("when no email provided, should return an error message", async () => {
    const errData = await request(app)
      .post("/user/authenticate")
      .send(users[2]);

    expect(errData.body.err).toBe("Please enter an email");
  });

  it("when provided password is incorrect, should return an error message", async () => {
    const errData = await request(app)
      .post("/user/authenticate")
      .send(users[3]);

    expect(errData.body.err).toBe(
      "Provide correct password. Password incorrect"
    );
  });
});

describe("POST /user/refreshToken", () => {
  it("when refresh token is verified,async should return new access token", async () => {
    const tokens = await request(app)
      .post("/user/authenticate")
      .set("Authorization", `Bearer ${process.env.RT}`);

    expect(tokens).toBeTruthy();
  });

  it("when refresh token is invalid, should return an error message", async () => {
    const err = await request(app)
      .post("/user/authenticate")
      .set("Authorization", `Bearer ${process.env.INVALID_RT}`);

    expect(err).toBeTruthy();
  });

  it("when refresh token doesn't exist, should return an error message", async () => {
    const err = await request(app).post("/user/authenticate");

    expect(err).toBeTruthy();
  });
});
