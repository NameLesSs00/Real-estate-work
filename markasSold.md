PUT
/api/Units/marksold


Parameters
Try it out
Name	Description
id
integer($int32)
(query)
id
Notes
string
(query)
Notes
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

PUT
/api/Units/reactivte-unit


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "projectId": 0,
  "unitId": 0,
  "isFeatured": true,
  "paymentPlans": [
    {
      "installmentMonthes": 0,
      "installmentDownPayment": 0,
      "paymentType": "string"
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
  "succeeded": true,
  "errors": [
    "string"
  ],
  "data": true
}
No links
UnitSoldout


GET
/api/unit-soldout


Parameters
Try it out
Name	Description
UnitName
string
(query)
UnitName
SoldType
string
(query)
SoldType
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
      "unitId": 0,
      "unitName": "string",
      "projectName": "string",
      "city": "string",
      "country": "string",
      "unitImages": [
        "string"
      ],
      "soldoutDate": "2026-05-05T15:00:52.435Z",
      "soldType": "string",
      "notes": "string",
      "createdBy": "string",
      "createdAt": "2026-05-05T15:00:52.435Z"
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
/api/unit-soldout/{id}


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
  "unitId": 0,
  "unitName": "string",
  "projectName": "string",
  "city": "string",
  "country": "string",
  "unitImages": [
    "string"
  ],
  "soldoutDate": "2026-05-05T15:00:52.438Z",
  "soldType": "string",
  "notes": "string",
  "createdBy": "string",
  "createdAt": "2026-05-05T15:00:52.438Z"
}


Deals


GET
/api/Deals


Parameters
Try it out
Name	Description
UnitId
integer($int32)
(query)
UnitId
ProjectId
integer($int32)
(query)
ProjectId
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
      "dealDate": "2026-05-05T15:05:42.412Z",
      "dealType": "string",
      "unit": {
        "unitId": 0,
        "unitName": "string",
        "price": 0,
        "area": 0,
        "isActive": true,
        "projectId": 0,
        "projectName": "string"
      },
      "unitDetails": {
        "unitDetailId": 0,
        "commissionRate": 0,
        "installmentMothes": 0,
        "installmentDownPayment": 0,
        "paymentType": "string",
        "status": "string"
      },
      "buyer": {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "dealDate": "2026-05-05T15:05:42.412Z",
        "dealLocation": "string"
      },
      "createdBy": "string",
      "createdAt": "2026-05-05T15:05:42.412Z",
      "updatedBy": "string",
      "updatedAt": "2026-05-05T15:05:42.412Z"
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
/api/Deals


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "unitPlanId": 0,
  "fullName": "string",
  "email": "string",
  "phone": "string"
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
/api/Deals/unit/{unitId}


Parameters
Try it out
Name	Description
unitId *
integer($int32)
(path)
unitId
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
  "items": [
    {
      "id": 0,
      "dealDate": "2026-05-05T15:05:42.421Z",
      "dealType": "string",
      "unit": {
        "unitId": 0,
        "unitName": "string",
        "price": 0,
        "area": 0,
        "isActive": true,
        "projectId": 0,
        "projectName": "string"
      },
      "unitDetails": {
        "unitDetailId": 0,
        "commissionRate": 0,
        "installmentMothes": 0,
        "installmentDownPayment": 0,
        "paymentType": "string",
        "status": "string"
      },
      "buyer": {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "dealDate": "2026-05-05T15:05:42.421Z",
        "dealLocation": "string"
      },
      "createdBy": "string",
      "createdAt": "2026-05-05T15:05:42.421Z",
      "updatedBy": "string",
      "updatedAt": "2026-05-05T15:05:42.421Z"
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
/api/Deals/latest


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
  "items": [
    {
      "id": 0,
      "dealDate": "2026-05-05T15:05:42.426Z",
      "dealType": "string",
      "unit": {
        "unitId": 0,
        "unitName": "string",
        "price": 0,
        "area": 0,
        "isActive": true,
        "projectId": 0,
        "projectName": "string"
      },
      "unitDetails": {
        "unitDetailId": 0,
        "commissionRate": 0,
        "installmentMothes": 0,
        "installmentDownPayment": 0,
        "paymentType": "string",
        "status": "string"
      },
      "buyer": {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "dealDate": "2026-05-05T15:05:42.426Z",
        "dealLocation": "string"
      },
      "createdBy": "string",
      "createdAt": "2026-05-05T15:05:42.426Z",
      "updatedBy": "string",
      "updatedAt": "2026-05-05T15:05:42.426Z"
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
/api/Deals/project/{projectId}


Parameters
Try it out
Name	Description
projectId *
integer($int32)
(path)
projectId
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
  "items": [
    {
      "id": 0,
      "dealDate": "2026-05-05T15:05:42.432Z",
      "dealType": "string",
      "unit": {
        "unitId": 0,
        "unitName": "string",
        "price": 0,
        "area": 0,
        "isActive": true,
        "projectId": 0,
        "projectName": "string"
      },
      "unitDetails": {
        "unitDetailId": 0,
        "commissionRate": 0,
        "installmentMothes": 0,
        "installmentDownPayment": 0,
        "paymentType": "string",
        "status": "string"
      },
      "buyer": {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "dealDate": "2026-05-05T15:05:42.432Z",
        "dealLocation": "string"
      },
      "createdBy": "string",
      "createdAt": "2026-05-05T15:05:42.432Z",
      "updatedBy": "string",
      "updatedAt": "2026-05-05T15:05:42.432Z"
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
/api/Deals/unit/{unitId}/compatibility


Parameters
Try it out
Name	Description
unitId *
integer($int32)
(path)
unitId
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
  "items": [
    {
      "id": 0,
      "dealDate": "2026-05-05T15:05:42.445Z",
      "dealType": "string",
      "unit": {
        "unitId": 0,
        "unitName": "string",
        "price": 0,
        "area": 0,
        "isActive": true,
        "projectId": 0,
        "projectName": "string"
      },
      "unitDetails": {
        "unitDetailId": 0,
        "commissionRate": 0,
        "installmentMothes": 0,
        "installmentDownPayment": 0,
        "paymentType": "string",
        "status": "string"
      },
      "buyer": {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "dealDate": "2026-05-05T15:05:42.445Z",
        "dealLocation": "string"
      },
      "createdBy": "string",
      "createdAt": "2026-05-05T15:05:42.445Z",
      "updatedBy": "string",
      "updatedAt": "2026-05-05T15:05:42.445Z"
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
/api/Deals/{id}


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
  "dealDate": "2026-05-05T15:05:42.451Z",
  "dealType": "string",
  "unit": {
    "unitId": 0,
    "unitName": "string",
    "price": 0,
    "area": 0,
    "isActive": true,
    "projectId": 0,
    "projectName": "string"
  },
  "unitDetails": {
    "unitDetailId": 0,
    "commissionRate": 0,
    "installmentMothes": 0,
    "installmentDownPayment": 0,
    "paymentType": "string",
    "status": "string"
  },
  "buyer": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "dealDate": "2026-05-05T15:05:42.451Z",
    "dealLocation": "string"
  },
  "createdBy": "string",
  "createdAt": "2026-05-05T15:05:42.451Z",
  "updatedBy": "string",
  "updatedAt": "2026-05-05T15:05:42.451Z"
}