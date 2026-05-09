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
      "createdAt": "2026-05-09T09:51:36.800Z",
      "updatedBy": "string",
      "updatedAt": "2026-05-09T09:51:36.800Z"
    }
  ],
  "pageNumber": 0,
  "totalPages": 0,
  "totalCount": 0,
  "hasPreviousPage": true,
  "hasNextPage": true
}

Units


GET
/api/Units


Parameters
Cancel
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
PropertyType
string
(query)
PropertyType
UnitType
string
(query)
UnitType
Unitstatus
string
(query)
Unitstatus
ProjectId
integer($int32)
(query)
ProjectId
LocationId
integer($int32)
(query)
LocationId
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
[
  {
    "id": 0,
    "markerId": "string",
    "name": "string",
    "description": "string",
    "price": 0,
    "currencyCode": "string",
    "area": 0,
    "noBathRoom": 0,
    "noBedRoom": 0,
    "noKitchen": 0,
    "floorName": "string",
    "floorNumber": 0,
    "unitType": "string",
    "unitStatus": "string",
    "view": "string",
    "propertyType": "string",
    "isFeatured": true,
    "isActive": true,
    "locationName": "string",
    "projectName": "string",
    "paymentPlans": [
      {
        "planStatus": "string",
        "installmentMothes": 0,
        "installmentDownPayment": 0,
        "paymentType": "string"
      }
    ],
    "imageUrls": [
      "string"
    ],
    "services": [
      0
    ],
    "createdBy": "string",
    "createdAt": "2026-05-09T09:52:17.880Z",
    "updatedBy": "string",
    "updatedAt": "2026-05-09T09:52:17.880Z"
  }
]


now the customer will create the same unit but we need to make sure there's a way to show the difference between them so to do that the backend have added a new field `markerId`  in it is a string that will show the marker id of the unit, the goal is we need to show it in the UI for the client user so he could tell the admin he want to buy the unit with this marker id  and in the admin view when the admin click on the unit to view it he will see the marker id and he will know which unit the client is talking about and he could then mark it as sold 

could you now make sure we change that for the clinet and the admin so we do the last change for this project ?
create a plan for this task