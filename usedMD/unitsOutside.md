now for the next endpoints we should be working on are the Resale units we should make sure that we have upadted the endpoits for it okay 
public enum PropertyType
{
    Apartment,
    Villa,
    Townhouse,
    Studio,
    Penthouse
        ,onebedroom,twobedroon,threebedroom,chalet,fourbedroom,studio,
}
those are the propertyTypes for the units in the get 

  "price": 0,
  "currencyCode": "string", those two will be ignored and we will send any dumm data in teh reuqet and we will not show them in the front nor when we get the data 
  propertyType is as i told you
  this should be false isSoldOutside prices[] here we should enter the 4 currentlies we have paymentPlan this could be empty , serviceIds this also could be empty but make sure we could have many of them 

now create a plan so that we implnet those new endpoints and update the old ones and make sure it works right create a plan and let me review it

UnitOutsides


GET
/api/unit-outsides


Parameters
Try it out
Name	Description
SearchTerm
string
(query)
SearchTerm
Search
string
(query)
Search
PropertyType
string
(query)
PropertyType
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
IsSoldOutside
boolean
(query)

--
NoFloor
integer($int32)
(query)
NoFloor
MinFloor
integer($int32)
(query)
MinFloor
MaxFloor
integer($int32)
(query)
MaxFloor
FeatureId
integer($int32)
(query)
FeatureId
FeatureName
string
(query)
FeatureName
SortBy
string
(query)
SortBy
SortDirection
string
(query)
SortDirection
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
      "markerId": "string",
      "isSoldOutside": true,
      "noFloor": 0,
      "prices": [
        {
          "id": 0,
          "currency": "string",
          "price": 0
        }
      ],
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
      "serviceIds": [
        0
      ],
      "createdBy": "string",
      "createdAt": "2026-09-06T10:20:45.320Z",
      "updatedBy": "string",
      "updatedAt": "2026-09-06T10:20:45.320Z"
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
/api/unit-outsides


Parameters
Cancel
No parameters

Request body

application/json
{
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
  "isSoldOutside": true,
  "noFloor": 0,
  "prices": [
    {
      "currency": "string",
      "price": 0
    }
  ],
  "paymentPlan": [
    {
      "commissionRate": 0,
      "installmentMothes": 0,
      "installmentDownPayment": 0,
      "paymentType": "string"
    }
  ],
  "serviceIds": [
    0
  ]
}
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
0
No links



GET
/api/unit-outsides/{id}


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
Default value : EGP

EGP
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
  "markerId": "string",
  "isSoldOutside": true,
  "noFloor": 0,
  "prices": [
    {
      "id": 0,
      "currency": "string",
      "price": 0
    }
  ],
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
  "serviceIds": [
    0
  ],
  "createdBy": "string",
  "createdAt": "2026-09-06T10:20:45.332Z",
  "updatedBy": "string",
  "updatedAt": "2026-09-06T10:20:45.332Z"
}
No links

PUT
/api/unit-outsides/{id}


Parameters
Try it out
Name	Description
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
  "isSoldOutside": true,
  "noFloor": 0,
  "images": [
    "string"
  ],
  "prices": [
    {
      "id": 0,
      "currency": "string",
      "price": 0
    }
  ],
  "paymentPlan": [
    {
      "commissionRate": 0,
      "installmentMothes": 0,
      "installmentDownPayment": 0,
      "paymentType": "string"
    }
  ],
  "serviceIds": [
    0
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
true
No links

DELETE
/api/unit-outsides/{id}


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
/api/unit-outsides/images


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
/api/unit-outsides/{unitId}/images/{imageId}


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
/api/unit-outsides/marksold


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