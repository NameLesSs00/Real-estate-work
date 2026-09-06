here we will create a plan for the app to work even better we want the admin to be able to add social links for himself so we have creaetd the endpoint for the key and value we will add a new section in the admin and we will use the get all when we first load the app so the footer and about us and the floating whatsapp icon and the data next to the form in the contact page under the Get in Touch should also use all of that 
here is the data you should be adding in the backend and that we will be using we will also in the backend will not link the delete and the add we will only create the needed stuff we only need and if the data value is # then we will hide it in the UI okay 
here is the data that should be there 
the key : facebook 
the value :https://www.facebook.com/profile.php?id=61593947270509#
, phone number 
the key : phone 
the value :+20 12 00339790
, whatsapp number 
the key : whatsapp 
the value :+20 12 00339790
, instgram 
the key : instagram 
the value :#
,
email
 the key : email 
the value :info@therock-realestate.com
could you create a plan to add them in the backend end and also link the endpoint in the new tab and also only add the stuff I wanted here is the token you will be using please create a plan and also don't forget to we should call them once in the app when we first load and we should have them in the app and if we don't have them we should re fetch them from the fetch all okay ? please create a plan and tell me what you gonna do the token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJjYmM0MGQ4OS03ZjhiLTQ4NmUtOTE4My00ZDcyOTQ3YmEwMDEiLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGUuY29tIiwidW5pcXVlX25hbWUiOiJTeXN0ZW0gQWRtaW4iLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTc4ODcwMTk2NywiZXhwIjoxNzg4NzA1NTY3LCJpYXQiOjE3ODg3MDE5NjcsImlzcyI6IlJlYWxFc3RhdGVBUEkiLCJhdWQiOiJSZWFsRXN0YXRlQ2xpZW50In0.LHyio3WOTjZr--cREHOeLAwf74zSPWbkS6m-1vCmZas

KeyValues


GET
/api/KeyValues


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
    "key": "string",
    "value": "string"
  }
]
No links

POST
/api/KeyValues


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "key": "string",
  "value": "string"
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
{
  "id": 0,
  "key": "string",
  "value": "string"
}
No links

PUT
/api/KeyValues


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 0,
  "key": "string",
  "value": "string"
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
{
  "id": 0,
  "key": "string",
  "value": "string"
}
No links

GET
/api/KeyValues/{id}


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
  "key": "string",
  "value": "string"
}
No links

DELETE
/api/KeyValues/{id}


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