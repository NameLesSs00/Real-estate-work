for the next section is the locations it has been updated a bit to only have the following data that is main lcation and the sublcaoint and main image and sub image i don't care about the sub image at all and we will not add it at all the only thing you should note is the locatoins main locaotin is reuqired but the sub is not reuqired okay ? could you create a plan to implment this in the admin pages so that it works right ?
Locations


GET
/api/Locations


Parameters
Cancel
Name	Description
IsFeature
boolean
(query)

true
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://api.therock-realestate.com/api/Locations?IsFeature=true' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxOTA0MzRhYS0wM2IwLTQwNDUtOTgwNC00MDlhYzBjYzJiNjAiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4ODYxMTEyOCwiZXhwIjoxNzg4NjE0NzI4LCJpYXQiOjE3ODg2MTExMjgsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.jX2bEHC67TICGq4eWfIrvlhGfNg_Hq93w1KGFpArZbg'
Request URL
https://api.therock-realestate.com/api/Locations?IsFeature=true
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "",
  "data": {
    "items": [
      {
        "id": 21,
        "mainLocation": "string",
        "locationImageUrl": "images/locations/a2f1fb16-2d3e-48b4-b9e9-aac76913325b.webp",
        "subLocation": "",
        "subLocationImageUrl": null,
        "isFeature": true,
        "country": "",
        "street": null,
        "latitude": null,
        "longitude": null,
        "city": "string",
        "district": "",
        "imageUrl": "images/locations/a2f1fb16-2d3e-48b4-b9e9-aac76913325b.webp",
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-09-05T12:39:36.9912122",
        "updatedBy": null,
        "updatedAt": null
      }
    ],
    "pageNumber": 1,
    "totalPages": 1,
    "totalCount": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,05 Sep 2026 13:04:39 GMT 
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
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "id": 0,
        "mainLocation": "string",
        "locationImageUrl": "string",
        "subLocation": "string",
        "subLocationImageUrl": "string",
        "isFeature": true,
        "country": "string",
        "street": "string",
        "latitude": "string",
        "longitude": "string",
        "city": "string",
        "district": "string",
        "imageUrl": "string",
        "createdBy": "string",
        "createdAt": "2026-09-05T13:04:59.263Z",
        "updatedBy": "string",
        "updatedAt": "2026-09-05T13:04:59.263Z"
      }
    ],
    "pageNumber": 0,
    "totalPages": 0,
    "totalCount": 0,
    "hasPreviousPage": true,
    "hasNextPage": true
  },
  "errors": "string"
}
No links

POST
/api/Locations


Parameters
Cancel
Reset
No parameters

Request body

multipart/form-data
MainLocation.En
string
string
Send empty value
MainLocation.De
string
string
Send empty value
MainLocation.It
string
string
Send empty value
SubLocation.En
string
SubLocation.En
Send empty value
SubLocation.De
string
SubLocation.De
Send empty value
SubLocation.It
string
SubLocation.It
Send empty value
LocationImage
string($binary)
No file chosen
Send empty value
SubLocationImage
string($binary)
No file chosen
Send empty value
IsFeature
boolean

true
Send empty value
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://api.therock-realestate.com/api/Locations' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxOTA0MzRhYS0wM2IwLTQwNDUtOTgwNC00MDlhYzBjYzJiNjAiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4ODYxMTEyOCwiZXhwIjoxNzg4NjE0NzI4LCJpYXQiOjE3ODg2MTExMjgsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.jX2bEHC67TICGq4eWfIrvlhGfNg_Hq93w1KGFpArZbg' \
  -H 'Content-Type: multipart/form-data' \
  -F 'MainLocation.De=string' \
  -F 'SubLocation.En=' \
  -F 'SubLocation.It=' \
  -F 'SubLocationImage=' \
  -F 'LocationImage=' \
  -F 'MainLocation.En=string' \
  -F 'MainLocation.It=string' \
  -F 'IsFeature=true' \
  -F 'SubLocation.De='
Request URL
https://api.therock-realestate.com/api/Locations
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": 22,
  "errors": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,05 Sep 2026 13:04:47 GMT 
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
0
No links

PUT
/api/Locations



GET
/api/Locations/{id}


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
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "mainLocation": "string",
    "locationImageUrl": "string",
    "subLocation": "string",
    "subLocationImageUrl": "string",
    "isFeature": true,
    "country": "string",
    "street": "string",
    "latitude": "string",
    "longitude": "string",
    "city": "string",
    "district": "string",
    "imageUrl": "string",
    "createdBy": "string",
    "createdAt": "2026-09-05T13:04:59.349Z",
    "updatedBy": "string",
    "updatedAt": "2026-09-05T13:04:59.349Z"
  },
  "errors": "string"
}
No links

DELETE
/api/Locations/{id}


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