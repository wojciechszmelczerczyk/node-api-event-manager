# Get events

## Description

Get all events of currently authorized user.

<b>URL :</b> `/event`

<b>Method:</b> `GET`

<b>Authorized:</b> `YES`

## Success Response

Code: `200 OK`

### Context example

Condition: If user provided valid, non-expired jwt.

```json
[
  {
    "__v": 0,
    "_id": "63bb140ae1716d34afcec913",
    "email": "wnowak@gmail.com",
    "endDate": "2013-01-01T00:00:00.000Z",
    "eventTitle": "football match",
    "firstName": "Wojciech",
    "lastName": "Nowak",
    "startDate": "2012-01-01T00:00:00.000Z"
  },
  {
    "__v": 0,
    "_id": "63bb143be1716d34afcec916",
    "email": "wnowak@gmail.com",
    "endDate": "2013-02-02T00:00:00.000Z",
    "eventTitle": "jogging",
    "firstName": "Wojciech",
    "lastName": "Nowak",
    "startDate": "2012-02-01T00:00:00.000Z"
  }
]
```

## Error response

Code: `403 Forbidden`

Condition: If user provided expired jwt.

```json
jwt expired
```
