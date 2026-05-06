UnitOutsides


GET
/api/UnitOutsides


Parameters
Try it out
Name	Description
SearchTerm
string
(query)
SearchTerm
MinPrice
number($double)
(query)
MinPrice
MaxPrice
number($double)
(query)
MaxPrice
City
string
(query)
City
Country
string
(query)
Country
Currency
string
(query)
Currency
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
      "name": "string",
      "description": "string",
      "price": 0,
      "currencyCode": "string",
      "area": 0,
      "noBathRoom": 0,
      "noBedRoom": 0,
      "noKitchen": 0,
      "country": "string",
      "city": "string",
      "street": "string",
      "propertyType": "string",
      "floorNumber": 0,
      "view": "string",
      "type": "string",
      "floorName": "string",
      "isFeatured": true,
      "isActive": true,
      "soldCount": 0,
      "images": [
        {
          "id": 0,
          "imageUrl": "string",
          "isPrimary": true,
          "sortOrder": 0
        }
      ],
      "paymentPlans": [
        {
          "id": 0,
          "commissionRate": 0,
          "installmentMothes": 0,
          "installmentDownPayment": 0,
          "paymentType": "string",
          "status": "string"
        }
      ],
      "createdBy": "string",
      "createdAt": "2026-05-06T15:16:24.996Z",
      "updatedBy": "string",
      "updatedAt": "2026-05-06T15:16:24.996Z"
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
/api/UnitOutsides


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
    "pl": "string"
  },
  "description": {
    "en": "string",
    "de": "string",
    "pl": "string"
  },
  "price": 0,
  "currencyCode": "string",
  "area": 0,
  "noBathRoom": 0,
  "noBedRoom": 0,
  "noKitchen": 0,
  "country": "string",
  "city": "string",
  "street": "string",
  "propertyType": "string",
  "floorNumber": 0,
  "view": "string",
  "type": "string",
  "floorName": "string",
  "isFeatured": true,
  "paymentPlan": [
    {
      "commissionRate": 0,
      "installmentMothes": 0,
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
0
No links

PUT
/api/UnitOutsides


Parameters
Try it out
No parameters

Request body

multipart/form-data
Id
integer($int32)
Name.En
string
Name.De
string
Name.Pl
string
Description.En
string
Description.De
string
Description.Pl
string
Price
number($double)
CurrencyCode
string
Area
integer($int32)
NoBathRoom
integer($int32)
NoBedRoom
integer($int32)
NoKitchen
integer($int32)
Country
string
City
string
Street
string
PropertyType
string
FloorNumber
integer($int32)
View
string
Type
string
FloorName
string
IsFeatured
boolean
Images
array
PaymentPlan
array
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

GET
/api/UnitOutsides/{id}


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
currency
string
(query)
Default value : USD

USD
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
  "description": "string",
  "price": 0,
  "currencyCode": "string",
  "area": 0,
  "noBathRoom": 0,
  "noBedRoom": 0,
  "noKitchen": 0,
  "country": "string",
  "city": "string",
  "street": "string",
  "propertyType": "string",
  "floorNumber": 0,
  "view": "string",
  "type": "string",
  "floorName": "string",
  "isFeatured": true,
  "isActive": true,
  "soldCount": 0,
  "images": [
    {
      "id": 0,
      "imageUrl": "string",
      "isPrimary": true,
      "sortOrder": 0
    }
  ],
  "paymentPlans": [
    {
      "id": 0,
      "commissionRate": 0,
      "installmentMothes": 0,
      "installmentDownPayment": 0,
      "paymentType": "string",
      "status": "string"
    }
  ],
  "createdBy": "string",
  "createdAt": "2026-05-06T15:16:25.000Z",
  "updatedBy": "string",
  "updatedAt": "2026-05-06T15:16:25.000Z"
}
No links

DELETE
/api/UnitOutsides/{id}


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
No links

POST
/api/UnitOutsides/images


Parameters
Try it out
No parameters

Request body

multipart/form-data
UnitOutsideId
integer($int32)
Images
array
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
/api/UnitOutsides/{unitId}/images/{imageId}


Parameters
Try it out
Name	Description
unitId *
integer($int32)
(path)
unitId
imageId *
integer($int32)
(path)
imageId
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

PUT
/api/UnitOutsides/marksold


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 0,
  "paymentplanId": 0
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
true
No links
UnitOutsideSoldouts


GET
/api/UnitOutsideSoldouts


Parameters
Try it out
Name	Description
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
      "unitOutsideId": 0,
      "unitOutsideName": "string",
      "soldoutDate": "2026-05-06T15:16:25.004Z",
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
  "unitOutsideId": 0,
  "unitOutsideName": "string",
  "soldoutDate": "2026-05-06T15:16:25.023Z",
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
No links

DELETE
/api/UnitOutsideSoldouts/{id}


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
No links
