Projects


GET
/api/Projects


Parameters
Cancel
Name	Description
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://api.thegate-estates.com/api/Projects' \
  -H 'accept: text/plain'
Request URL
https://api.thegate-estates.com/api/Projects
Server response
Code	Details
200	
Response body
Download
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
        "facilities": [],
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-05T19:19:02.1119044",
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
        "facilities": [],
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-05T19:19:02.111849",
        "updatedBy": "",
        "updatedAt": null
      },
      {
        "id": 3,
        "name": "MARVENTO BEACH",
        "description": "",
        "developerId": 2,
        "developerName": "IMPERIOR",
        "locationId": 5,
        "locationName": "HURGHADA, ALAHIAA",
        "imageUrls": [
          "images/projects/5e25a032-565c-490a-a983-899f500eee27.webp",
          "images/projects/796cd865-9d4d-4a8d-8583-9c36b76eb0c9.webp",
          "images/projects/15860c0c-a81f-48e0-b207-c4347b79680e.webp",
          "images/projects/ad51883e-c789-4ede-adfc-d1fb42b03bab.webp",
          "images/projects/07f4be83-cf8f-466a-9e29-32dadd2c971f.webp",
          "images/projects/208795f8-2ff5-4a51-86aa-350ddd9e2c47.webp",
          "images/projects/4da311ad-a4a9-4c8f-a9f9-c5f11f069baf.webp",
          "images/projects/4255a92c-3c77-437f-984d-2e523d369f3d.webp",
          "images/projects/8f9d816a-a724-439e-9a74-4a0bd6bceb42.webp",
          "images/projects/61697318-8b39-4acb-8aa2-2efe226e3ab9.webp"
        ],
        "facilities": [],
        "createdBy": "Mo@gmail.com",
        "createdAt": "2026-05-05T19:54:12.8118966",
        "updatedBy": "Mo@gmail.com",
        "updatedAt": "2026-05-06T16:08:27.7470757"
      },
      {
        "id": 4,
        "name": "RIVA",
        "description": "",
        "developerId": 3,
        "developerName": "ETA",
        "locationId": 4,
        "locationName": "HURGHADA, -",
        "imageUrls": [],
        "facilities": [
          "Air Conditioning",
          "Swimming Pool",
          "Parking",
          "Security",
          "BEACH"
        ],
        "createdBy": "Mo@gmail.com",
        "createdAt": "2026-05-05T20:15:11.8222789",
        "updatedBy": "Mo@gmail.com",
        "updatedAt": "2026-05-05T20:15:32.7664424"
      },
      {
        "id": 5,
        "name": "VERANDA SAHL HASHESH",
        "description": "",
        "developerId": 4,
        "developerName": "SELENA",
        "locationId": 6,
        "locationName": "HURGHADA, SAHL HASHESH",
        "imageUrls": [
          "images/projects/0efa864f-a19a-4e50-8110-8ec9ae677eba.webp",
          "images/projects/d87b7beb-99b2-44b5-a915-22abd1c6d0c3.webp",
          "images/projects/f069ebc4-2520-4905-99e7-56931de987b6.webp",
          "images/projects/9db05fd9-f647-4c40-bf68-0c3203a2e408.webp",
          "images/projects/41e0ae17-35d0-48ea-b1f7-af21f8e623b5.webp",
          "images/projects/002e970d-3b51-4cb5-8a52-163dc5635725.webp",
          "images/projects/c9b9a0db-a171-4907-99db-aedfa64d11b3.webp",
          "images/projects/e7e8fa35-720f-4cf2-914d-b0d159082952.webp",
          "images/projects/da4deef1-1e9e-4556-b27a-084e90e86615.webp",
          "images/projects/8848013d-a009-4357-98ea-4f12bfbbc7cd.webp"
        ],
        "facilities": [],
        "createdBy": "Mo@gmail.com",
        "createdAt": "2026-05-05T20:16:36.2607531",
        "updatedBy": "Mo@gmail.com",
        "updatedAt": "2026-05-06T16:09:07.5254466"
      },
      {
        "id": 6,
        "name": "string",
        "description": "string",
        "developerId": 3,
        "developerName": "ETA",
        "locationId": 4,
        "locationName": "HURGHADA, -",
        "imageUrls": [],
        "facilities": [],
        "createdBy": "Mo@gmail.com",
        "createdAt": "2026-05-05T21:05:25.9350495",
        "updatedBy": "admin@realestate.com",
        "updatedAt": "2026-05-06T13:49:55.4671408"
      },
      {
        "id": 7,
        "name": "Eta name",
        "description": "eta desc",
        "developerId": 3,
        "developerName": "ETA",
        "locationId": 4,
        "locationName": "HURGHADA, -",
        "imageUrls": [
          "images/projects/cdfbf4c3-04b6-44ac-82f9-f466c8cbbe0b.webp",
          "images/projects/c1c89969-eaac-45a4-883a-77b79a0f5541.webp",
          "images/projects/f61f0d5d-0142-4559-9999-bd1e4f468925.webp"
        ],
        "facilities": [
          "Air Conditioning",
          "Parking"
        ],
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-06T12:44:17.1101612",
        "updatedBy": "admin@realestate.com",
        "updatedAt": "2026-05-06T13:08:52.5033278"
      },
      {
        "id": 8,
        "name": "en",
        "description": "en",
        "developerId": 3,
        "developerName": "ETA",
        "locationId": 4,
        "locationName": "HURGHADA, -",
        "imageUrls": [],
        "facilities": [],
        "createdBy": "Mo@gmail.com",
        "createdAt": "2026-05-06T12:51:17.9774907",
        "updatedBy": "admin@realestate.com",
        "updatedAt": "2026-05-06T13:15:42.632286"
      },
      {
        "id": 9,
        "name": "en",
        "description": "en",
        "developerId": 5,
        "developerName": "RESALEE",
        "locationId": 6,
        "locationName": "HURGHADA, SAHL HASHESH",
        "imageUrls": [],
        "facilities": [],
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-06T12:53:25.7990127",
        "updatedBy": "admin@realestate.com",
        "updatedAt": "2026-05-06T13:17:49.6890326"
      },
      {
        "id": 10,
        "name": "facility",
        "description": "facility",
        "developerId": 4,
        "developerName": "SELENA",
        "locationId": 4,
        "locationName": "HURGHADA, -",
        "imageUrls": [],
        "facilities": [
          "Air Conditioning",
          "Parking"
        ],
        "createdBy": "admin@realestate.com",
        "createdAt": "2026-05-06T14:47:53.3661607",
        "updatedBy": "admin@realestate.com",
        "updatedAt": "2026-05-06T15:11:00.6686193"
      }
    ],
    "pageNumber": 1,
    "totalPages": 2,
    "totalCount": 15,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "errors": null
}