Review


GET
/api/Review


Parameters
Try it out
Name	Description
pageNumber
integer($int32)
(query)
Default value : 1

1
pageSize
integer($int32)
(query)
Default value : 10

10
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
  "reviews": [
    {
      "id": 0,
      "fullName": "string",
      "unitId": 0,
      "unitName": "string",
      "comment": "string",
      "rate": 0,
      "createdAt": "2026-05-09T07:34:26.565Z"
    }
  ],
  "totalCount": 0,
  "pageNumber": 0,
  "pageSize": 0
}
No links

POST
/api/Review


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "fullName": "string",
  "unitId": 0,
  "comment": "string",
  "rate": 0
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
  "fullName": "string",
  "unitId": 0,
  "unitName": "string",
  "comment": "string",
  "rate": 0,
  "createdAt": "2026-05-09T07:34:26.568Z"
}
No links

PUT
/api/Review


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 0,
  "fullName": "string",
  "comment": "string",
  "rate": 0
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
  "fullName": "string",
  "unitId": 0,
  "unitName": "string",
  "comment": "string",
  "rate": 0,
  "createdAt": "2026-05-09T07:34:26.570Z"
}
No links

GET
/api/Review/{id}


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
  "fullName": "string",
  "unitId": 0,
  "unitName": "string",
  "comment": "string",
  "rate": 0,
  "createdAt": "2026-05-09T07:34:26.572Z"
}
No links

DELETE
/api/Review/{id}


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

No links

GET
/api/Review/unit/{unitId}


Parameters
Try it out
Name	Description
unitId *
integer($int32)
(path)
unitId
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
    "fullName": "string",
    "unitId": 0,
    "unitName": "string",
    "comment": "string",
    "rate": 0,
    "createdAt": "2026-05-09T07:34:26.575Z"
  }
]
No links

GET
/api/Review/unit/{unitId}/average


Parameters
Cancel
Name	Description
unitId *
integer($int32)
(path)
unitId
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://api.thegate-estates.com/api/Review/unit/1/average' \
  -H 'accept: text/plain'
Request URL
https://api.thegate-estates.com/api/Review/unit/1/average
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "unitId": 1,
    "averageRating": 0
  },
  "errors": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,09 May 2026 07:34:19 GMT 
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


now we need to create the comment sectoin in unit details page insted of the commet sectoin coming soon in that page we should create a plan to use those endpoints to get the data and display it in the unit details page

make sure it's responsive and easy to use

for each unit we shoule get the average rating and the number of reviews

we should also display the reviews in the unit details page

and we should also display the add review form in the unit details page

and in the admin page we should be able to view all of the comments and be able to delete them becuase we could have a negitavie comment and we need to remove it if need so we will create a new page in the admin view for deleting comments 
could you make a better plan for that ?