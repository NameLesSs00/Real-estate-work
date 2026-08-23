ProjectImagePricelists


GET
/api/projects/{projectId}/image-pricelists


Parameters
Cancel
Name	Description
projectId *
integer($int32)
(path)
3
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://realestateneww.runasp.net/api/projects/3/image-pricelists' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjYmM0MGQ4OS03ZjhiLTQ4NmUtOTE4My00ZDcyOTQ3YmEwMDEiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4NzQ4MDQzMCwiZXhwIjoxNzg3NDg0MDMwLCJpYXQiOjE3ODc0ODA0MzAsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.j44aEtPjYZP5OOxFqYRC4tHKCurUavbopU5Jg5ssFf8'
Request URL
https://realestateneww.runasp.net/api/projects/3/image-pricelists
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "",
  "data": [
    {
      "id": 1,
      "projectId": 3,
      "name": "price Listing testing",
      "imageUrl": "images/projects/pricelists/6425cb34-7fce-4c9b-bf66-91db06b4dfb6.webp",
      "displayOrder": 1
    }
  ],
  "errors": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sun,23 Aug 2026 10:20:56 GMT 
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
  "data": [
    {
      "id": 0,
      "projectId": 0,
      "name": "string",
      "imageUrl": "string",
      "displayOrder": 0
    }
  ],
  "errors": "string"
}
No links

POST
/api/projects/{projectId}/image-pricelists


Parameters
Cancel
Reset
Name	Description
projectId *
integer($int32)
(path)
3
Request body

multipart/form-data
ProjectId
integer($int32)
3
Send empty value
Name
string
price Listing testing
Send empty value
Image
string($binary)
rook-logo-mark-light.png
Send empty value
DisplayOrder
integer($int32)
1
Send empty value
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://realestateneww.runasp.net/api/projects/3/image-pricelists' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjYmM0MGQ4OS03ZjhiLTQ4NmUtOTE4My00ZDcyOTQ3YmEwMDEiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4NzQ4MDQzMCwiZXhwIjoxNzg3NDg0MDMwLCJpYXQiOjE3ODc0ODA0MzAsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.j44aEtPjYZP5OOxFqYRC4tHKCurUavbopU5Jg5ssFf8' \
  -H 'Content-Type: multipart/form-data' \
  -F 'ProjectId=3' \
  -F 'Name=price Listing testing' \
  -F 'Image=@rook-logo-mark-light.png;type=image/png' \
  -F 'DisplayOrder=1'
Request URL
https://realestateneww.runasp.net/api/projects/3/image-pricelists
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": 1,
  "errors": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sun,23 Aug 2026 10:20:49 GMT 
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
  "succeeded": true,
  "errors": [
    "string"
  ],
  "data": 0
}
No links

GET
/api/projects/{projectId}/image-pricelists/{id}


Parameters
Cancel
Name	Description
projectId *
integer($int32)
(path)
3
id *
integer($int32)
(path)
1
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://realestateneww.runasp.net/api/projects/3/image-pricelists/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjYmM0MGQ4OS03ZjhiLTQ4NmUtOTE4My00ZDcyOTQ3YmEwMDEiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4NzQ4MDQzMCwiZXhwIjoxNzg3NDg0MDMwLCJpYXQiOjE3ODc0ODA0MzAsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.j44aEtPjYZP5OOxFqYRC4tHKCurUavbopU5Jg5ssFf8'
Request URL
https://realestateneww.runasp.net/api/projects/3/image-pricelists/1
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "",
  "data": {
    "id": 1,
    "projectId": 3,
    "name": "testing new listing",
    "imageUrl": "images/projects/pricelists/d9b05628-f6f5-47d7-9dfa-d781e576a344.webp",
    "displayOrder": 2
  },
  "errors": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sun,23 Aug 2026 10:22:02 GMT 
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
    "id": 0,
    "projectId": 0,
    "name": "string",
    "imageUrl": "string",
    "displayOrder": 0
  },
  "errors": "string"
}
No links

PUT
/api/projects/{projectId}/image-pricelists/{id}


Parameters
Cancel
Reset
Name	Description
projectId *
integer($int32)
(path)
3
id *
integer($int32)
(path)
1
Request body

multipart/form-data
Id
integer($int32)
1
Send empty value
ProjectId
integer($int32)
3
Send empty value
Name
string
testing new listing
Send empty value
Image
string($binary)
rook-logo-mark-blue.png
Send empty value
DisplayOrder
integer($int32)
2
Send empty value
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://realestateneww.runasp.net/api/projects/3/image-pricelists/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjYmM0MGQ4OS03ZjhiLTQ4NmUtOTE4My00ZDcyOTQ3YmEwMDEiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4NzQ4MDQzMCwiZXhwIjoxNzg3NDg0MDMwLCJpYXQiOjE3ODc0ODA0MzAsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.j44aEtPjYZP5OOxFqYRC4tHKCurUavbopU5Jg5ssFf8' \
  -H 'Content-Type: multipart/form-data' \
  -F 'Id=1' \
  -F 'ProjectId=3' \
  -F 'Name=testing new listing' \
  -F 'Image=@rook-logo-mark-blue.png;type=image/png' \
  -F 'DisplayOrder=2'
Request URL
https://realestateneww.runasp.net/api/projects/3/image-pricelists/1
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": 1,
  "errors": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sun,23 Aug 2026 10:21:58 GMT 
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
  "succeeded": true,
  "errors": [
    "string"
  ],
  "data": 0
}
No links

DELETE
/api/projects/{projectId}/image-pricelists/{id}


Parameters
Cancel
Name	Description
projectId *
integer($int32)
(path)
3
id *
integer($int32)
(path)
1
Execute
Clear
Responses
Curl

curl -X 'DELETE' \
  'https://realestateneww.runasp.net/api/projects/3/image-pricelists/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjYmM0MGQ4OS03ZjhiLTQ4NmUtOTE4My00ZDcyOTQ3YmEwMDEiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4NzQ4MDQzMCwiZXhwIjoxNzg3NDg0MDMwLCJpYXQiOjE3ODc0ODA0MzAsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.j44aEtPjYZP5OOxFqYRC4tHKCurUavbopU5Jg5ssFf8'
Request URL
https://realestateneww.runasp.net/api/projects/3/image-pricelists/1
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": 1,
  "errors": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sun,23 Aug 2026 10:22:15 GMT 
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
  "succeeded": true,
  "errors": [
    "string"
  ],
  "data": 0
}
those are the endpoints that gonna be used for the projects 
here we should be able to add the pirce list image and names and orders for the pirces for a project we should create a plan so that it works right in the admin page could you create a plan for it 
the best way to do that is after you create a project in the actions you will have a doller sign next to the edit when you click on it you can view all of the pirces images and the names for them in a popup window after you create one you could view it 
later we will add it in the single project but first we need to make sure the admin pages work right could you create a plan for it 