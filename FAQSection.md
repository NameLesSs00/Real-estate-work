Questions


GET
/api/Questions


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
[
  {
    "id": 0,
    "title": "string",
    "description": "string",
    "createdAt": "2026-05-07T13:54:57.513Z"
  }
]
No links

POST
/api/Questions


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "title": "string",
  "description": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "title": "string",
  "description": "string",
  "createdAt": "2026-05-07T13:54:55.654Z"
}
No links

PUT
/api/Questions


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 0,
  "title": "string",
  "description": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "title": "string",
  "description": "string",
  "createdAt": "2026-05-07T13:54:55.656Z"
}
No links

GET
/api/Questions/{id}


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "title": "string",
  "description": "string",
  "createdAt": "2026-05-07T13:54:55.659Z"
}
No links

DELETE
/api/Questions/{id}


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
true

