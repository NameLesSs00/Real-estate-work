PaymentPlans


POST
/api/payment-plans


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "paymentType": "string",
  "unitId": 0,
  "installmentDownPayment": 0,
  "installmentYears": 0
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

PUT
/api/payment-plans


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "paymentPlanId": 0,
  "paymentType": "string",
  "status": 0,
  "installmentDownPayment": 0,
  "installmentYears": 0
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
  "data": true
}
No links

DELETE
/api/payment-plans/{id}


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
  "succeeded": true,
  "errors": [
    "string"
  ],
  "data": true
}
No links

GET
/api/payment-plans/unit/{unitId}


Parameters
Cancel
Name	Description
unitId *
integer($int32)
(path)
1
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://api.thegate-estates.com/api/payment-plans/unit/1' \
  -H 'accept: text/plain'
Request URL
https://api.thegate-estates.com/api/payment-plans/unit/1
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
      "unitId": 1,
      "unitName": "plams",
      "installmentDownPayment": 20,
      "installmentMonths": 9,
      "paymentType": "Installment",
      "unitStatus": "Approved",
      "createdBy": "Mo@gmail.com",
      "createdAt": "2026-05-02T17:17:27.5399058",
      "updatedBy": null,
      "updatedAt": null
    }
  ],
  "errors": null
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Tue,05 May 2026 15:48:00 GMT 
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
  "data": [
    {
      "id": 0,
      "unitId": 0,
      "unitName": "string",
      "installmentDownPayment": 0,
      "installmentMonths": 0,
      "paymentType": "string",
      "unitStatus": "string",
      "createdBy": "string",
      "createdAt": "2026-05-05T15:48:05.964Z",
      "updatedBy": "string",
      "updatedAt": "2026-05-05T15:48:05.964Z"
    }
  ]
}