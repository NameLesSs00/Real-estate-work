Locations


GET
/api/Locations
{
  "success": true,
  "message": "",
  "data": {
    "items": [
      {
        "id": 1,
        "country": "",
        "city": "Cairo",
        "district": "New Cairo",
        "street": null,
        "latitude": null,
        "longitude": null,
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-02T09:18:17.6435352",
        "updatedBy": "",
        "updatedAt": null
      },
      {
        "id": 2,
        "country": "",
        "city": "Cairo",
        "district": "Maadi",
        "street": null,
        "latitude": null,
        "longitude": null,
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-02T09:18:17.6453453",
        "updatedBy": "",
        "updatedAt": null
      },
      {
        "id": 3,
        "country": "",
        "city": "Giza",
        "district": "Sheikh Zayed",
        "street": null,
        "latitude": null,
        "longitude": null,
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-02T09:18:17.6453624",
        "updatedBy": "",
        "updatedAt": null
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

it has pagaination

POST
/api/Locations
{
  "city": "string",
  "district": "string",
  "street": "string",
  "country": "string",
  "latitude": "string",
  "longitude": "string"
}
set the latitude,  longitude to be always null 


PUT
/api/Locations
{
  "id": 0,
  "city": "string",
  "district": "string",
  "street": "string",
  "country": "string",
  "latitude": "string",
  "longitude": "string"
}


GET
/api/Locations/{id}
{
  "success": true,
  "message": "",
  "data": {
    "id": 1,
    "country": "",
    "city": "Cairo",
    "district": "New Cairo",
    "street": null,
    "latitude": null,
    "longitude": null,
    "createdBy": "admin@realestate.com",
    "createdAt": "2026-05-02T09:18:17.6435352",
    "updatedBy": "",
    "updatedAt": null
  },
  "errors": null
}


DELETE
/api/Locations/{id}
{
  "success": true,
  "message": "Operation completed successfully",
  "data": true,
  "errors": null
}