Projects


GET
/api/Projects
{
  "success": true,
  "message": "",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Palm Hills",
        "description": "Luxury complex",
        "developerId": null,
        "developerName": "",
        "locationId": null,
        "locationName": "",
        "imageUrls": [],
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-02T09:18:17.8746826",
        "updatedBy": "",
        "updatedAt": null
      },
      {
        "id": 2,
        "name": "Mountain View",
        "description": "Modern living",
        "developerId": null,
        "developerName": "",
        "locationId": null,
        "locationName": "",
        "imageUrls": [],
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-02T09:18:17.8746558",
        "updatedBy": "",
        "updatedAt": null
      }
    ],
    "pageNumber": 1,
    "totalPages": 1,
    "totalCount": 2,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null
}


POST
/api/Projects
{
  "name": "string",
  "description": "string",
  "developerId": 0,
  "locationId": 0
}
(to make it easy for the user make it so that the devloperId and the locationId is also we call the api for them get all and we have a drop down menu where we show them to the user by name and we have the id hidden but we use it )

GET
/api/Projects/{id}



PUT
/api/Projects/{id}
{
  "id": 0,
  "name": "string",
  "description": "string",
  "developerId": 0
}


DELETE
/api/Projects/{id}



POST
/api/Projects/{id}/images
here you could add a list of images 


POST
/api/Projects/AddUnitProject
{
  "projectId": 0,
  "units": [
    {
      "name": "string",
      "description": "string",
      "price": 0,
      "propertyType": 0,
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
      "facilityIds": [
        0
      ],
      "servicesIds": [
        0
      ]
    }
  ]
}


PUT
/api/Projects/UpdateUnit
{
  "id": 0,
  "name": "string",
  "description": "string",
  "price": 0,
  "propertyType": 0,
  "noBathRoom": 0,
  "noBedRoom": 0,
  "noKitchen": 0,
  "floorName": "string",
  "isFeatured": true
}


DELETE
/api/Projects/DeleteUnit/{id}



POST
/api/Projects/{id}/uploadUnit/images
you could also here add many images 


DELETE
/api/Projects/{id}/deleteproject/images



DELETE
/api/Projects/{id}/deleteUnit/images



Units


GET
/api/Units
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "items": [],
    "pageNumber": 1,
    "totalPages": 0,
    "totalCount": 0,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null
}


GET
/api/Units/{id}
{
  "id": 0,
  "name": "string",
  "description": "string",
  "price": 0,
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
  "facilities": [
    "string"
  ],
  "services": [
    "string"
  ],
  "createdBy": "string",
  "createdAt": "2026-05-02T15:40:03.747Z",
  "updatedBy": "string",
  "updatedAt": "2026-05-02T15:40:03.747Z"
}


PUT
/api/Units/marksold
