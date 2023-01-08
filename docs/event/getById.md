# Get event by title

## Description

Get event of currently authorized user by title.

<b>URL :</b> `/event/:title`

<b>Method:</b> `GET`

<b>URL parameter:</b> `title=[string]`.

<b>Authorized:</b> `YES`

## Success Response

Code: `200 OK`

Condition: If event with provided title exists.

```json
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
```
