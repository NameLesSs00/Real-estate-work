now create a folder for the auth we need to create those endoint 
Auth endpoints

POST
/api/Auth/login
{
  "email": "string",
  "password": "string"
}
admin@realestate.com
Admin123!

response 
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJlOTBiNjUzYy03YzAyLTRkY2UtYWM5Ny00OTBhMzhiMzlhY2MiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3Nzc3MjcwMjQsImV4cCI6MTc3NzczMDYyNCwiaWF0IjoxNzc3NzI3MDI0LCJpc3MiOiJSZWFsRXN0YXRlQVBJIiwiYXVkIjoiUmVhbEVzdGF0ZUNsaWVudCJ9.GoApAVroo7T3YMXKvpH0Ie36DJdXS2DDT3Q-ddk_rbU",
    "refreshToken": "cdb20NxwNCnrZccGuaWSl22wejsvgvW1dUODZHMHhzU=",
    "email": "admin@realestate.com",
    "fullName": "System Admin"
  },
  "errors": null
}

POST
/api/Auth/logout



POST
/api/Auth/add-admin



PUT
/api/Auth/update-password



POST
/api/Auth/refresh-token
{
  "refreshToken": "string"
}


	
Response body
Download
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJlOTBiNjUzYy03YzAyLTRkY2UtYWM5Ny00OTBhMzhiMzlhY2MiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3Nzc3MjcwNjAsImV4cCI6MTc3NzczMDY2MCwiaWF0IjoxNzc3NzI3MDYwLCJpc3MiOiJSZWFsRXN0YXRlQVBJIiwiYXVkIjoiUmVhbEVzdGF0ZUNsaWVudCJ9.qR03vIerw9UT6yg83s4rAXXxfIbq_SjBDxpr-d0xpEI",
    "refreshToken": "hmTRc+hwvAUAJCqpdqDSvJXVcm79eVNAd6uewkzGcsM=",
    "email": "admin@realestate.com",
    "fullName": "System Admin"
  },
  "errors": null
}

we need only to implment the login and the logout and the refresh token endoint  the other will be added later 
the point of those are for the admin to view the admin pages if the admin does not have the token it should use the middleware and redirect it to the not found page could you create this flow and use the best pracites and if there is an error please should it in the console 