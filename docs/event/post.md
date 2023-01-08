# Create event

## Description

Create new event.

<b>URL:</b> `/event`

<b>Method:</b> `POST`

<b>Authorized:</b> `YES`

## Data constraints

```json
{
  "eventTitle": "[string (4-8 characters range)]",
  "startDate": "[string (date format)]",
  "endDate": "[string (date format)]"
}
```

## Data example

```json
{
  "eventTitle": "football match",
  "startDate": "2012-01-01",
  "endDate": "2012-01-02"
}
```

## Success Response

Code: `200 OK`

Condition: If provided data is correct.

### Context example

```json
{
  "event": {
    "__v": 0,
    "_id": "63bb140ae1716d34afcec913",
    "email": "wnowak@gmail.com",
    "endDate": "2013-01-01T00:00:00.000Z",
    "eventTitle": "newEvent",
    "firstName": "Wojciech",
    "lastName": "Nowak",
    "startDate": "2012-01-01T00:00:00.000Z"
  }
}
```
