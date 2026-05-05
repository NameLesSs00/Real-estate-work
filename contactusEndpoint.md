Contacts


GET
/api/Contacts


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
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "type": "BuyUnit",
    "hearFrom": "SocialMedia",
    "status": "Pending",
    "notes": "string",
    "createdAt": "2026-05-05T16:14:09.228Z",
    "updatedAt": "2026-05-05T16:14:09.228Z"
  }
]
No links

POST
/api/Contacts


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "type": "BuyUnit",
  "hearFrom": "SocialMedia",
  "notes": "string"
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
  "succeeded": true,
  "errors": [
    "string"
  ],
  "data": 0
}
No links

GET
/api/Contacts/{id}


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
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "type": "BuyUnit",
  "hearFrom": "SocialMedia",
  "status": "Pending",
  "notes": "string",
  "createdAt": "2026-05-05T16:14:09.232Z",
  "updatedAt": "2026-05-05T16:14:09.232Z"
}
No links

DELETE
/api/Contacts/{id}


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
No links

PUT
/api/Contacts/{id}/status


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
Request body

application/json
Example Value
Schema
{
  "status": "Pending"
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
true