for those endpoints they will be used also in the admin pages in the projects also we should add an icon after we create the project to add the pyament plans for it when we view them we should view all of the payment plans and also we could edit , delete and even create a new one as a projet could have many fo them 
here are also things you need to know when creating a new one paymentType is public enum PaymentType
    {
        Cash,
        Installment
    }
    public enum PropertyStatus
    {
        Approved = 0,
        Sold=1
    } and also the status is the same as PropertyStatus commissionRate could be null and is between 1 and 99 and the price we should note that it's in the EUROs okay when we show it later in the project or in the admin UI 

now could you create a full plan so that we could implment this in the app ? for the admin for now 

PaymentPlans 


GET
/api/projects/{projectId}/payment-plans


Parameters
Try it out
Name	Description
projectId *
integer($int32)
(path)
projectId
ProjectId
integer($int32)
(query)
ProjectId
PaymentType
string
(query)
PaymentType
Status
integer($int32)
(query)
Available values : 0, 1


--
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
      "projectId": 0,
      "projectName": "string",
      "commissionRate": 0,
      "installmentDownPayment": 0,
      "installmentMonths": 0,
      "paymentType": "string",
      "status": "string",
      "createdBy": "string",
      "createdAt": "2026-09-05T12:54:11.657Z",
      "updatedBy": "string",
      "updatedAt": "2026-09-05T12:54:11.657Z"
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
/api/projects/{projectId}/payment-plans


Parameters
Try it out
Name	Description
projectId *
integer($int32)
(path)
projectId
Request body

application/json
Example Value
Schema
{
  "projectId": 0,
  "paymentType": "string",
  "installmentDownPayment": 0,
  "installmentYears": 0,
  "installmentMonths": 0,
  "commissionRate": 0,
  "status": 0
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
/api/projects/{projectId}/payment-plans/{id}


Parameters
Try it out
Name	Description
projectId *
integer($int32)
(path)
projectId
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
  "projectId": 0,
  "projectName": "string",
  "commissionRate": 0,
  "installmentDownPayment": 0,
  "installmentMonths": 0,
  "paymentType": "string",
  "status": "string",
  "createdBy": "string",
  "createdAt": "2026-09-05T12:54:11.663Z",
  "updatedBy": "string",
  "updatedAt": "2026-09-05T12:54:11.663Z"
}
No links

PUT
/api/projects/{projectId}/payment-plans/{id}


Parameters
Try it out
Name	Description
projectId *
integer($int32)
(path)
projectId
id *
integer($int32)
(path)
id
Request body

application/json
Example Value
Schema
{
  "id": 0,
  "projectId": 0,
  "paymentType": "string",
  "installmentDownPayment": 0,
  "installmentYears": 0,
  "installmentMonths": 0,
  "commissionRate": 0,
  "status": 0
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
/api/projects/{projectId}/payment-plans/{id}


Parameters
Try it out
Name	Description
projectId *
integer($int32)
(path)
projectId
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