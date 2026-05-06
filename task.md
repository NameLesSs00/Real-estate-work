DELETE
/api/Units/delete-unit-service


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "unitId": 0,
  "serviceId": 0
}
Services


GET
/api/Services


Parameters
Try it out
No parameters

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
    "name": "string"
  }
]
POST
/api/Projects/AddUnitProject


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "projectId": 0,
  "units": [
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
      "propertyType": 0,
      "status": "string",
      "type": "string",
      "noBathRoom": 0,
      "noBedRoom": 0,
      "floorNumber": 0,
      "area": 0,
      "noKithchen": 0,
      "floorName": "string",
      "view": 0,
      "paymentPlans": [
        {
          "installmentMonthes": 0,
          "installmentDownPayment": 0,
          "paymentType": "string"
        }
      ],
      "isFeatured": true,
      "servicesIds": [
        0
      ]
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
/api/Projects/UpdateUnit


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
    "pl": "string"
  },
  "description": {
    "en": "string",
    "de": "string",
    "pl": "string"
  },
  "price": 0,
  "currencyCode": "string",
  "propertyType": 0,
  "noBathRoom": 0,
  "noBedRoom": 0,
  "noKitchen": 0,
  "area": 0,
  "status": "string",
  "type": "string",
  "floorNumber": 0,
  "view": 0,
  "floorName": "string",
  "servicesIds": [
    0
  ],
  "paymentPlans": [
    {
      "installmentMonthes": 0,
      "installmentDownPayment": 0,
      "paymentType": "string"
    }
  ],
  "isFeatured": true
}