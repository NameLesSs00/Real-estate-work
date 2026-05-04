GET
/api/Admins


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
      "id": "string",
      "username": "string",
      "email": "string",
      "createdAt": "2026-05-04T12:07:28.657Z"
    }
  ],
  "pageNumber": 0,
  "totalPages": 0,
  "totalCount": 0,
  "hasPreviousPage": true,
  "hasNextPage": true
}

PUT
/api/Admins/update


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "userName": "string",
  "email": "string",
  "phoneNumber": "string"
}
Responses
Code	Description	Links
200	
OK


POST
/api/Auth/add-admin


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
Responses
Code	Description	Links
200	
OK

PUT
/api/Auth/update-password


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "oldPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
Responses
Code	Description	Links
200	
OK



also more detalies we will get error when we try to do anythings those error sometimes are helpful for the user in the password upade and in the add admin we should view those error meesage in the front 

could you add those in the settings page ?