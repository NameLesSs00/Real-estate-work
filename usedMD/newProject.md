now we should creaet a plan to add the new endpoints for the projects here are some notes you should take care of 
first of all we should put all of the prices 
second we could put the projectTypeIds and facilityIds array of items but we should have at least one projectTypeIds furnitureType are enum and they are public enum FurnitureType
{
    None = 0,
    Semi = 1,
    Fully = 2
}
please create a plan so that we can implment the new projects and also make sure the UI is looking great and make sure we should putting all of the prices if we didn't we will get an error could you create a plan so thet we update those enpointds ?
Projects


GET
/api/Projects


Parameters
Cancel
Name	Description
ProjectTypeId
integer($int32)
(query)
ProjectTypeId
MinimumPrice
number($double)
(query)
MinimumPrice
MaximumPrice
number($double)
(query)
MaximumPrice
PriceCurrency
string
(query)
PriceCurrency
Currency
string
(query)
Currency
IsFurniture
boolean
(query)

--
FurnitureType
integer($int32)
(query)

--
DeliveryDateFrom
string($date-time)
(query)
DeliveryDateFrom
DeliveryDateTo
string($date-time)
(query)
DeliveryDateTo
IsFeature
boolean
(query)

--
FeatureId
integer($int32)
(query)
FeatureId
FacilityId
integer($int32)
(query)
FacilityId
LocationId
integer($int32)
(query)
LocationId
DeveloperId
integer($int32)
(query)
DeveloperId
SearchTerm
string
(query)
SearchTerm
Search
string
(query)
Search
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
  'https://api.therock-realestate.com/api/Projects' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxOTA0MzRhYS0wM2IwLTQwNDUtOTgwNC00MDlhYzBjYzJiNjAiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4ODYxMDE1OCwiZXhwIjoxNzg4NjEzNzU4LCJpYXQiOjE3ODg2MTAxNTgsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.K89I6Nt-NSSFXnHi7fkA3p2apXvodIg8eR7i7Qh-p7o'
Request URL
https://api.therock-realestate.com/api/Projects
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
        "id": 3,
        "name": "123",
        "description": "123",
        "developerId": 1,
        "developerName": "ts",
        "logoImage": "images/developers/408bac3b-39fe-48ad-9a01-878ab35145f0.webp",
        "locationId": 20,
        "locationName": "test, test",
        "deliveryDate": "2027-09-05T12:08:21.822",
        "isFurniture": true,
        "furnitureType": "None",
        "isFeature": true,
        "prices": [
          {
            "id": 1,
            "currency": "USD",
            "minimumPrice": 10,
            "maximumPrice": 100
          },
          {
            "id": 2,
            "currency": "EGP",
            "minimumPrice": 10,
            "maximumPrice": 100
          },
          {
            "id": 3,
            "currency": "EUR",
            "minimumPrice": 10,
            "maximumPrice": 100
          },
          {
            "id": 4,
            "currency": "GBP",
            "minimumPrice": 10,
            "maximumPrice": 100
          }
        ],
        "projectTypes": [
          {
            "id": 2,
            "name": "string",
            "icon": "string"
          },
          {
            "id": 3,
            "name": "2bed",
            "icon": "Bed"
          }
        ],
        "projectTypeIds": [
          2,
          3
        ],
        "imageUrls": [],
        "facilities": [],
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-09-05T12:10:25.0089553",
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
 date: Sat,05 Sep 2026 12:13:59 GMT 
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
        "name": "string",
        "description": "string",
        "developerId": 0,
        "developerName": "string",
        "logoImage": "string",
        "locationId": 0,
        "locationName": "string",
        "deliveryDate": "2026-09-05T12:14:00.693Z",
        "isFurniture": true,
        "furnitureType": "string",
        "isFeature": true,
        "prices": [
          {
            "id": 0,
            "currency": "string",
            "minimumPrice": 0,
            "maximumPrice": 0
          }
        ],
        "projectTypes": [
          {
            "id": 0,
            "name": "string",
            "icon": "string"
          }
        ],
        "projectTypeIds": [
          0
        ],
        "imageUrls": [
          "string"
        ],
        "facilities": [
          0
        ],
        "createdBy": "string",
        "createdAt": "2026-09-05T12:14:00.693Z",
        "updatedBy": "string",
        "updatedAt": "2026-09-05T12:14:00.693Z"
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
/api/Projects


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "name": {
    "en": "123",
    "de": "321",
    "it": "111"
  },
  "description": {
  "en": "123",
    "de": "321",
    "it": "111"
  },
  "locationId": 20,
  "developerId": 1,
  "deliveryDate": "2027-09-05T12:08:21.822Z",
  "isFurniture": true,
  "furnitureType": 0,
  "isFeature": true,
  "projectTypeIds": [
    3,2
  ],
  "facilityIds": [
    
  ],
  "prices": [
    {
      "currency": "USD",
      "minimumPrice": 10,
      "maximumPrice": 100
    },
{
      "currency": "EGP",
      "minimumPrice": 10,
      "maximumPrice": 100
    },
{
      "currency": "EUR",
      "minimumPrice": 10,
      "maximumPrice": 100
    },
{
      "currency": "GBP",
      "minimumPrice": 10,
      "maximumPrice": 100
    }
  ]
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://api.therock-realestate.com/api/Projects' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxOTA0MzRhYS0wM2IwLTQwNDUtOTgwNC00MDlhYzBjYzJiNjAiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4ODYxMDE1OCwiZXhwIjoxNzg4NjEzNzU4LCJpYXQiOjE3ODg2MTAxNTgsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.K89I6Nt-NSSFXnHi7fkA3p2apXvodIg8eR7i7Qh-p7o' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": {
    "en": "123",
    "de": "321",
    "it": "111"
  },
  "description": {
  "en": "123",
    "de": "321",
    "it": "111"
  },
  "locationId": 20,
  "developerId": 1,
  "deliveryDate": "2027-09-05T12:08:21.822Z",
  "isFurniture": true,
  "furnitureType": 0,
  "isFeature": true,
  "projectTypeIds": [
    3,2
  ],
  "facilityIds": [
    
  ],
  "prices": [
    {
      "currency": "USD",
      "minimumPrice": 10,
      "maximumPrice": 100
    },
{
      "currency": "EGP",
      "minimumPrice": 10,
      "maximumPrice": 100
    },
{
      "currency": "EUR",
      "minimumPrice": 10,
      "maximumPrice": 100
    },
{
      "currency": "GBP",
      "minimumPrice": 10,
      "maximumPrice": 100
    }
  ]
}'
Request URL
https://api.therock-realestate.com/api/Projects
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": 3,
  "errors": null
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,05 Sep 2026 12:10:25 GMT 
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
/api/Projects


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 0,
  "name": {
    "en": "string",
    "de": "string",
    "it": "string"
  },
  "description": {
    "en": "string",
    "de": "string",
    "it": "string"
  },
  "developerId": 0,
  "locationId": 0,
  "deliveryDate": "2026-09-05T12:14:00.702Z",
  "isFurniture": true,
  "furnitureType": 0,
  "isFeature": true,
  "projectTypeIds": [
    0
  ],
  "facilityIds": [
    0
  ],
  "prices": [
    {
      "currency": "string",
      "minimumPrice": 0,
      "maximumPrice": 0
    }
  ]
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
  "success": true,
  "message": "string",
  "data": 0,
  "errors": "string"
}
No links

GET
/api/Projects/{id}


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
    "name": "string",
    "description": "string",
    "developerId": 0,
    "developerName": "string",
    "logoImage": "string",
    "locationId": 0,
    "locationName": "string",
    "deliveryDate": "2026-09-05T12:14:00.705Z",
    "isFurniture": true,
    "furnitureType": "string",
    "isFeature": true,
    "prices": [
      {
        "id": 0,
        "currency": "string",
        "minimumPrice": 0,
        "maximumPrice": 0
      }
    ],
    "projectTypes": [
      {
        "id": 0,
        "name": "string",
        "icon": "string"
      }
    ],
    "projectTypeIds": [
      0
    ],
    "imageUrls": [
      "string"
    ],
    "facilities": [
      0
    ],
    "createdBy": "string",
    "createdAt": "2026-09-05T12:14:00.705Z",
    "updatedBy": "string",
    "updatedAt": "2026-09-05T12:14:00.705Z"
  },
  "errors": "string"
}
No links

DELETE
/api/Projects/{id}


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