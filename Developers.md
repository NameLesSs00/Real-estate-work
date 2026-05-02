Developers


POST
/api/Developers
{
  "name": "string",
  "description": "string"
}


PUT
/api/Developers
{
  "id": 0,
  "name": "string",
  "description": "string"
}


GET
/api/Developers
{
  "success": true,
  "message": "",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "firstDev",
        "logoImage": null,
        "description": "firstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDevfirstDev",
        "gallery": [],
        "projects": [],
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-02T13:57:25.1191486",
        "updatedBy": "",
        "updatedAt": null
      }
    ],
    "pageNumber": 1,
    "totalPages": 1,
    "totalCount": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null
}


DELETE
/api/Developers/{id}



GET
/api/Developers/{id}



POST
/api/Developers/{id}/logo
it taks mult data format for the image


DELETE
/api/Developers/{id}/logo



POST
/api/Developers/{id}/gallery
same it tasks mlut data format for the images and you could add many 
{
  "success": true,
  "message": "Gallery images uploaded successfully.",
  "data": [
    "images/galleries/0ab5d4fa-d894-4eea-9597-fef9b721c57f.webp",
    "images/galleries/9d34dc61-1d06-481c-9089-bfc8bf78ef1e.webp",
    "images/galleries/ee6841f4-9295-442d-ba7e-259f9b8c61bf.webp"
  ],
  "errors": null
}


DELETE
/api/Developers/gallery/{id}
you could delete that gallery by the id you enter 