Facilities


GET
/api/Facilities


Parameters
Cancel
No parameters

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://api.therock-realestate.com/api/Facilities' \
  -H 'accept: text/plain'
Request URL
https://api.therock-realestate.com/api/Facilities
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [
    {
      "id": 1,
      "name": "Air Conditioning",
      "icon": null
    },
    {
      "id": 2,
      "name": "Swimming Pool",
      "icon": null
    },
    {
      "id": 3,
      "name": "Gym",
      "icon": null
    },
    {
      "id": 4,
      "name": "Parking",
      "icon": null
    },
    {
      "id": 5,
      "name": "Security",
      "icon": null
    }
  ],
  "errors": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,05 Sep 2026 11:00:17 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
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
    "name": "string",
    "icon": "string"
  }
]
No links

POST
/api/Facilities


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "name": {
    "en": "string",
    "de": "string",
    "it": "string"
  },
  "icon": "string"
}
Services


GET
/api/Services


Parameters
Cancel
No parameters

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://api.therock-realestate.com/api/Services' \
  -H 'accept: text/plain'
Request URL
https://api.therock-realestate.com/api/Services
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [],
  "errors": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,05 Sep 2026 11:01:39 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
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
    "name": "string",
    "icon": "string"
  }
]
No links

POST
/api/Services


Parameters
Cancel
No parameters

Request body

application/json
{
  "name": {
    "en": "string",
    "de": "string",
    "it": "string"
  },
  "icon": "string"
}
Execute
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
0
the endpoints for both the Facilities and Services have been update to accept an icon I'll tell you how we will update it in the UI later but I want you to make sure that we have the endpoints and used right all of the endpoins for them now the update and the post now have icons so make sure it works right and the icon gonna be a simple string so could you create a plan so that we update the endpoints and later we can update the UI
create a plan for those could you do this ?