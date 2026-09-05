those are the project types that will be used later in the app the icons are things like the apparetment , 1 bed 2 , 3 beds dublix and things related to that so could you create a plan to add them in the admin page so that we could add them and edit , delete them ?
ProjectTypes


GET
/api/project-types


Parameters
Cancel
Name	Description
SearchTerm
string
(query)
SearchTerm
SortBy
string
(query)
SortBy
SortDirection
string
(query)
SortDirection
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
  'https://api.therock-realestate.com/api/project-types' \
  -H 'accept: text/plain'
Request URL
https://api.therock-realestate.com/api/project-types
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "string",
        "icon": "string"
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
 date: Sat,05 Sep 2026 11:39:42 GMT 
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
  "items": [
    {
      "id": 0,
      "name": "string",
      "icon": "string"
    }
  ],
  "pageNumber": 0,
  "totalPages": 0,
  "totalCount": 0,
  "hasPreviousPage": true,
  "hasNextPage": true
}
No links

POST
/api/project-types


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "name": {
    "en": "test",
    "de": "123",
    "it": "111"
  },
  "icon": "111"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://api.therock-realestate.com/api/project-types' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxOTA0MzRhYS0wM2IwLTQwNDUtOTgwNC00MDlhYzBjYzJiNjAiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4ODYwODQwNiwiZXhwIjoxNzg4NjEyMDA2LCJpYXQiOjE3ODg2MDg0MDYsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.uDskdyGzoQTZBxLx0mfsGNV-TJonfd5bok4Zte96ak0' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": {
    "en": "test",
    "de": "123",
    "it": "111"
  },
  "icon": "111"
}'
Request URL
https://api.therock-realestate.com/api/project-types
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": 2,
  "errors": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,05 Sep 2026 11:40:21 GMT 
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

GET
/api/project-types/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
2
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://api.therock-realestate.com/api/project-types/2' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxOTA0MzRhYS0wM2IwLTQwNDUtOTgwNC00MDlhYzBjYzJiNjAiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4ODYwODQwNiwiZXhwIjoxNzg4NjEyMDA2LCJpYXQiOjE3ODg2MDg0MDYsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.uDskdyGzoQTZBxLx0mfsGNV-TJonfd5bok4Zte96ak0'
Request URL
https://api.therock-realestate.com/api/project-types/2
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": 2,
    "name": "test",
    "icon": "111"
  },
  "errors": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,05 Sep 2026 11:40:29 GMT 
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
  "id": 0,
  "name": "string",
  "icon": "string"
}
No links

PUT
/api/project-types/{id}


Parameters
Cancel
Reset
Name	Description
id *
integer($int32)
(path)
2
Request body

application/json
{
  "id": 2,
  "name": {
    "en": "string",
    "de": "string",
    "it": "string"
  },
  "icon": "string"
}
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://api.therock-realestate.com/api/project-types/2' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxOTA0MzRhYS0wM2IwLTQwNDUtOTgwNC00MDlhYzBjYzJiNjAiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4ODYwODQwNiwiZXhwIjoxNzg4NjEyMDA2LCJpYXQiOjE3ODg2MDg0MDYsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.uDskdyGzoQTZBxLx0mfsGNV-TJonfd5bok4Zte96ak0' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": 2,
  "name": {
    "en": "string",
    "de": "string",
    "it": "string"
  },
  "icon": "string"
}'
Request URL
https://api.therock-realestate.com/api/project-types/2
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": true,
  "errors": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,05 Sep 2026 11:40:45 GMT 
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
true
No links

DELETE
/api/project-types/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
1
Execute
Clear
Responses
Curl

curl -X 'DELETE' \
  'https://api.therock-realestate.com/api/project-types/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxOTA0MzRhYS0wM2IwLTQwNDUtOTgwNC00MDlhYzBjYzJiNjAiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4ODYwODQwNiwiZXhwIjoxNzg4NjEyMDA2LCJpYXQiOjE3ODg2MDg0MDYsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.uDskdyGzoQTZBxLx0mfsGNV-TJonfd5bok4Zte96ak0'
Request URL
https://api.therock-realestate.com/api/project-types/1
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": true,
  "errors": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,05 Sep 2026 11:40:35 GMT 
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
true