# Register

## Description

Register user.

<b>URL:</b> `/user`

<b>Method:</b> `POST`

<b>Authorized:</b> `NO`

## Data constraints

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string (correct email)",
  "password": "string (correct password)"
}
```

## Data example

```json
{
  "firstName": "Wojciech",
  "lastName": "Nowak",
  "email": "wnowak@gmail.com",
  "password": "password123"
}
```

## Success Response

Code: `200 OK`

Condition: If provided data is correct.

### Context example

```json
{
  "__v": 0,
  "_id": "63b86b9ea43fe56ff9f18f74",
  "email": "www@gmail.com",
  "firstName": "Wojciech",
  "lastName": "Szmeler",
  "password": "$2b$10$PS7KOA.qQNKBWLvbtNn96O9NznuLk.kSXs8CIspfm3NBS4P2FgIt."
}
```

## Error Response

Code: `400 BAD REQUEST`

Condition: If provided email has incorrect syntax.

```json
{
  "err": "user validation failed: email: Please enter a valid email"
}
```

Code: `400 BAD REQUEST`

Condition: If provided password has incorrect syntax.

```json
{
  "err": "user validation failed: password: Please enter a password"
}
```
