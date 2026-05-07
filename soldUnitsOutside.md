UnitOutsideSoldouts


GET
/api/UnitOutsideSoldouts


Parameters
Cancel
Name	Description
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
  'https://api.thegate-estates.com/api/UnitOutsideSoldouts' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZDkzOTNiNC02NGI0LTQ1ZDEtYTA2ZC03Nzc2ZGNkZWI1ZmQiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc3ODE1NjY0MiwiZXhwIjoxNzc4MTYwMjQyLCJpYXQiOjE3NzgxNTY2NDIsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.cxvC31vJmdeeVmGWoAgPSWRjH0JMHZgANF154NcxFw4'
Request URL
https://api.thegate-estates.com/api/UnitOutsideSoldouts
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
        "unitOutsideId": 1,
        "unitOutsideName": "Modern Apartment",
        "soldoutDate": "2026-05-06T14:17:05.1158493",
        "isActive": true,
        "paymentPlans": [
          {
            "id": 1,
            "commissionRate": 2.5,
            "installmentMothes": 60,
            "installmentDownPayment": 20,
            "paymentType": "Installment",
            "status": "Sold"
          }
        ]
      },
      {
        "id": 2,
        "unitOutsideId": 2,
        "unitOutsideName": "Kemo",
        "soldoutDate": "2026-05-06T16:27:50.5509765",
        "isActive": true,
        "paymentPlans": [
          {
            "id": 5,
            "commissionRate": 2,
            "installmentMothes": 0,
            "installmentDownPayment": 0,
            "paymentType": "Cash",
            "status": "Sold"
          }
        ]
      },
      {
        "id": 3,
        "unitOutsideId": 14,
        "unitOutsideName": "testUnit en",
        "soldoutDate": "2026-05-07T12:22:57.6812314",
        "isActive": true,
        "paymentPlans": [
          {
            "id": 9,
            "commissionRate": 0,
            "installmentMothes": 0,
            "installmentDownPayment": 0,
            "paymentType": "Cash",
            "status": "Sold"
          }
        ]
      }
    ],
    "pageNumber": 1,
    "totalPages": 1,
    "totalCount": 3,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Thu,07 May 2026 12:24:19 GMT 
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
      "unitOutsideId": 0,
      "unitOutsideName": "string",
      "soldoutDate": "2026-05-07T12:24:28.704Z",
      "isActive": true,
      "paymentPlans": [
        {
          "id": 0,
          "commissionRate": 0,
          "installmentMothes": 0,
          "installmentDownPayment": 0,
          "paymentType": "string",
          "status": "string"
        }
      ]
    }
  ],
  "pageNumber": 0,
  "totalPages": 0,
  "totalCount": 0,
  "hasPreviousPage": true,
  "hasNextPage": true
}
No links

GET
/api/UnitOutsideSoldouts/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
0
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
{
  "id": 0,
  "unitOutsideId": 0,
  "unitOutsideName": "string",
  "soldoutDate": "2026-05-07T12:24:28.706Z",
  "isActive": true,
  "paymentPlans": [
    {
      "id": 0,
      "commissionRate": 0,
      "installmentMothes": 0,
      "installmentDownPayment": 0,
      "paymentType": "string",
      "status": "string"
    }
  ]
}

in the dashbaord for the Sold Units it works corret for the normal units but the units outside need a new endpoint 
i have give them to you we should call them when the user select form the dropdorn menu the Resale optoin could you make sure the page sold-units for the admin works right ?
