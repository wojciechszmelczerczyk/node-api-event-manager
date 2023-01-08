# Get event by title

## Description

Get event of currently authorized user by title.

<b>URL :</b> `/event/:title`

<b>Method:</b> `GET`

<b>URL parameter:</b> `title=[string]`.

<b>Authorized:</b> `YES`

## Success Response

Code: `200 OK`

Condition: If note with provided correctly id exists.

```json
{
  "__v": 0,
  "_id": "63723e9cb7a6c7b6039003fa",
  "content": "some content",
  "createdAt": "2022-11-14T13:11:56.672Z",
  "title": "title",
  "updatedAt": "2022-11-14T13:11:56.672Z",
  "user_id": "63723da6b7a6c7b6039003f5"
}
```
