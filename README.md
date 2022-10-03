# Event App Manager API

## Description

REST API for Event Managment App

## Table of contents

- [Technologies](#technologies)
- [Requirements](#requirements)
- [Usage](#usage)
- [API endpoints](#api-endpoints)
- [JWT](#jwt)
- [Tests](#tests)

## Technologies

- `node`
- `express`
- `supertest`

## Requirements

- install `node`
- setup `mongodb`

## Usage

### Clone repository

```
git clone https://github.com/wojciechszmelczerczyk/node-api-event-manager.git
```

### Navigate to project folder

```sh
cd /node-api-event-manager
```

### Install dependencies

```
npm i
```

#### Run Express REST API

```sh
npm run dev
```

### Env setup

```dockerfile
# Uri to mongo database
DB_URI=

# Port
PORT=

# Arbitrary access token for testing purposes
AT=

# Arbitrary invalid access token for testing purposes
INVALID_AT=

# Arbitrary expired access token for testing purposes
EXPIRED_AT=

# Arbitrary refresh token for testing purposes
RT=

# Arbitrary invalid refresh token for testing purposes
INVALID_RT=

# Access token secret
AT_SECRET=

# Refresh token secret
RT_SECRET=

```

## API endpoints

### User:

| Endpoint             | Method | Authenticated | Action                                                   |
| :------------------- | :----: | :-----------: | :------------------------------------------------------- |
| `/user`              |  POST  |       -       | Create a new user                                        |
| `/user/authenticate` |  POST  |       -       | Authenticate user, return access token and refresh token |
| `/user/refreshToken` |  GET   |      \*       | Return new access token and refresh token                |

### Event:

| Endpoint        | Method | Authenticated | Action                            |
| :-------------- | :----: | :-----------: | :-------------------------------- |
| `/event`        |  GET   |      \*       | Return all events of current user |
| `/event/create` |  POST  |      \*       | Create a new event                |
| `/event/:title` |  GET   |      \*       | Get event by title                |
| `/event/:id`    | DELETE |      \*       | Delete event                      |

## JWT

### Token implementation

### Create new token helper function

#### Sign token with user credentials ie. first name, last name and email.

```javascript
export const createToken = (payload, secret, expTime) =>
  sign(payload, secret, { expiresIn: expTime });
```

## Tests

### To run tests

`npm run test`

### Flush document

When tests finished, delete most recent document from db

```javascript
export const flushLastDocument = async (Model) =>
  await Model.findOneAndDelete({}, { sort: { _id: -1 } });
```

### Data

Sample of data used in tests. All necessary data is imported as json module.

```json
[
  {
    "firstName": "first name",
    "lastName": "last name",
    "email": "test@gmail.com",
    "password": "test123"
  }
]
```

### User

#### `POST /user`

<details>
<summary>when all credentials correct, should create user</summary>

```javascript
it("when all credentials correct, should create user", async () => {
  const newUser = await request(app).post("/user").send(users[0]);

  // find created user in database
  const userFromDb = await User.findById(newUser.body._id);

  // if user credentials are correct, shouldn't be any error response back
  expect(newUser.error).not.toBeTruthy();

  // user should exist
  expect(userFromDb).toBeTruthy();
});
```

</details>

<details>
<summary>when email doesn't match email regex, should return an error message</summary>

```javascript
it("when email doesn't match email regex, should return an error message", async () => {
  const errData = await request(app).post("/user").send(users[1]);
  expect(errData.error).toBeTruthy();
  expect(errData.text).toBe(
    "user validation failed: email: Please enter a valid email"
  );
});
```

</details>

<details>
<summary>when no email provided, should return an error message</summary>

```javascript
it("when no email provided, should return an error message", async () => {
  const errData = await request(app).post("/user").send(users[2]);
  expect(errData.error).toBeTruthy();
  expect(errData.text).toBe(
    "user validation failed: email: Please enter an email"
  );
});
```

</details>

<details>
<summary>when provided password is shorter than 6, should return an error message</summary>

```javascript
it("when provided password is shorter than 6, should return an error message", async () => {
  const errData = await request(app).post("/user").send(users[3]);
  expect(errData.error).toBeTruthy();
  expect(errData.text).toBe(
    "user validation failed: password: Password is too short. Minimum length is 6 characters"
  );
});
```

</details>
<br/>

#### `POST /user/authenticate`

<details>
<summary>when provided user credentials match with user from db, return access token and refresh token</summary>
 
 ```javascript
 it("when provided user credentials match with user from db, return access token and refresh token", async () => {
    const { body } = await request(app)
      .post("/user/authenticate")
      .send(users[0]);
    expect(body.accessToken && body.refreshToken).toBeTruthy();
  });
  ```
</details>
<details>
<summary>when email doesn't match email regex, should return an error message</summary>

```javascript
it("when email doesn't match email regex, should return an error message", async () => {
  const errData = await request(app).post("/user/authenticate").send(users[1]);

  expect(errData.error).toBeTruthy();
  expect(errData.text).toBe(
    "Provide correct email. User with this email doesn't exist"
  );
});
```

</details>
<details>
<summary>when no email provided, should return an error message</summary>

```javascript
it("when no email provided, should return an error message", async () => {
  const errData = await request(app).post("/user/authenticate").send(users[2]);

  expect(errData.error).toBeTruthy();
  expect(errData.text).toBe("Please enter an email");
});
```

</details>
<details>
<summary>when provided password is incorrect, should return an error message</summary>

```javascript
it("when provided password is incorrect, should return an error message", async () => {
  const errData = await request(app).post("/user/authenticate").send(users[3]);

  expect(errData.error).toBeTruthy();
  expect(errData.text).toBe("Provide correct password. Password incorrect");
});
```

</details>
<br />

#### `POST /user/refreshToken`

<details>
<summary>when refresh token is verified, return new access token and refresh token</summary>

```javascript
it("when refresh token is verified, return new access token and refresh token", async () => {
  const newTokens = await request(app)
    .post("/user/authenticate")
    .set("Authorization", `Bearer ${process.env.RT}`);

  expect(newTokens).toBeTruthy();
});
```

</details>

<details>
<summary>when refresh token is invalid, should return an error message</summary>

```javascript
it("when refresh token is invalid, should return an error message", async () => {
  const err = await request(app)
    .post("/user/authenticate")
    .set("Authorization", `Bearer ${process.env.INVALID_RT}`);

  expect(err).toBeTruthy();
});
```

</details>

<details>
<summary>when refresh token doesn't exist, should return an error message</summary>

```javascript
it("when refresh token doesn't exist, should return an error message", async () => {
  const err = await request(app).post("/user/authenticate");

  expect(err).toBeTruthy();
});
```

</details>

<br/>

### Event

#### `POST /event/create`

<details>
<summary>when jwt is verified and event data payload is correct, should create new event</summary>
 
 ```javascript
it("when jwt is verified and event data payload is correct, should create new event", async () => {
    const newEvent = await request(app)
      .post("/event/create")
      .set("Authorization", `Bearer ${process.env.JWT}`)
      .send(events[0]);

    // event should exist
    const eventExist = await Event.findById(newEvent.body.event);

    expect(eventExist).toBeTruthy();

});

````
</details>

<details>
<summary>when jwt is verified and event data payload is incorrect, should return error message</summary>

 ```javascript
it("when jwt is verified and event data payload is incorrect, should return error message", async () => {
    const newEvent = await request(app)
      .post("/event/create")
      .set("Authorization", `Bearer ${process.env.JWT}`)
      .send(events[1]);

    expect(newEvent.error).toBeTruthy();
  });
````

</details>

<details>
<summary>when jwt is invalid, should return error message</summary>

```javascript
it("when jwt is invalid, should return error message", async () => {
  const newEvent = await request(app)
    .post("/event/create")
    .set("Authorization", `Bearer ${process.env.INVALID_JWT}`)
    .send(events[1]);

  expect(newEvent.text).toBe("jwt malformed");
});
```

</details>

<details>
<summary>when jwt has expired, should return error message</summary>

```javascript
it("when jwt has expired, should return error message", async () => {
  const newEvent = await request(app)
    .post("/event/create")
    .set("Authorization", `Bearer ${process.env.EXPIRED_JWT}`)
    .send(events[1]);

  expect(newEvent.text).toBe("jwt expired");
});
```

</details>
<br/>

#### `GET /event`

<details>
<summary>when jwt correct, should return all current user events</summary>

```javascript
it("when jwt correct, should return all current user events", async () => {
  const events = await request(app)
    .get("/event")
    .set("Authorization", `Bearer ${process.env.JWT}`);

  expect(events.body).toBeTruthy();
});
```

</details>

<details>
<summary>when jwt inccorrect, should return error message</summary>

```javascript
it("when jwt inccorrect, should return error message", async () => {
  const events = await request(app)
    .get("/event")
    .set("Authorization", `Bearer ${process.env.INVALID_AT}`);

  expect(events.error).toBeTruthy();
});
```

</details>

<details>
<summary>when jwt expired, should return error message</summary>

```javascript
it("when jwt expired, should return error message", async () => {
  const events = await request(app)
    .get("/event")
    .set("Authorization", `Bearer ${process.env.EXPIRED_AT}`);

  expect(events.error).toBeTruthy();
});
```

</details>

<br />

#### `GET /event/:email`

<details>
<summary>when jwt correct, should return specific event of current user</summary>
 
 ```javascript
it("when jwt correct, should return specific event of current user", async () => {
    const title = events[0].eventTitle;

    const event = await request(app)
      .get(`/event/${title}`)
      .set("Authorization", `Bearer ${process.env.AT}`);

    const isExist = await Event.findById(event.body._id);

    expect(isExist).toBeTruthy();

});

````
</details>

<details>

<summary>when jwt inccorrect, should return error message</summary>

 ```javascript
it("when jwt inccorrect, should return error message", async () => {
    const title = events[0].eventTitle;

    const event = await request(app)
      .get(`/event/${title}`)
      .set("Authorization", `Bearer ${process.env.INVALID_AT}`);

    expect(event.error).toBeTruthy();
  });
````

</details>

<details>
<summary>when jwt expired, should return error message</summary>

```javascript
it("when jwt expired, should return error message", async () => {
  const title = events[0].eventTitle;

  const event = await request(app)
    .get(`/event/${title}`)
    .set("Authorization", `Bearer ${process.env.EXPIRED_AT}`);

  expect(event.error).toBeTruthy();
});
```

</details>

<br />

#### `DELETE /event/:id`

<details>
<summary>when jwt correct and event with specified id exist, should delete event</summary>

```javascript
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
```

</details>
