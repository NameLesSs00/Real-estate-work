# RealEstate API — Full Reference Documentation

**Version:** v1  
**Spec:** OAS 3.0  
**Base URL:** `https://api.thegate-estates.com`  
**Authentication:** JWT Bearer Token

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents

1. [Auth](#1-auth)
2. [Admins](#2-admins)
3. [Applicants](#3-applicants)
4. [Deals](#4-deals)
5. [Developers](#5-developers)
6. [Facilities](#6-facilities)
7. [Leads](#7-leads)
8. [Locations](#8-locations)
9. [Payment Plans](#9-payment-plans)
10. [Projects](#10-projects)
11. [Requests](#11-requests)
12. [Services](#12-services)
13. [Units](#13-units)
14. [Unit Soldout](#14-unit-soldout)

---

## 1. Auth

### POST `/api/Auth/login`
Login and receive a JWT token.

**Request Body** (`application/json`):
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`

---

### POST `/api/Auth/logout`
Logout the current user (invalidates the refresh token).

**Request Body** (`application/json`):
```json
"string"
```
> Pass the refresh token string as the body.

**Response:** `200 OK`

---

### POST `/api/Auth/add-admin`
Register a new admin account.

**Request Body** (`application/json`):
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`

---

### PUT `/api/Auth/update-password`
Update the authenticated user's password.

**Request Body** (`application/json`):
```json
{
  "oldPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Response:** `200 OK`

---

### POST `/api/Auth/refresh-token`
Obtain a new access token using a refresh token.

**Request Body** (`application/json`):
```json
{
  "refreshToken": "string"
}
```

**Response:** `200 OK`

---

## 2. Admins

### GET `/api/Admins`
Retrieve a paginated list of all admins.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `PageNumber` | integer | Page number |
| `PageSize` | integer | Items per page |

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "createdAt": "2026-05-04T16:42:52.142Z"
    }
  ],
  "pageNumber": 0,
  "totalPages": 0,
  "totalCount": 0,
  "hasPreviousPage": true,
  "hasNextPage": true
}
```

---

### PUT `/api/Admins/update`
Update the currently authenticated admin's profile.

**Request Body** (`application/json`):
```json
{
  "userName": "string",
  "email": "string",
  "phoneNumber": "string"
}
```

**Response:** `200 OK`

---

## 3. Applicants

### GET `/api/Applicants`
Retrieve a paginated list of applicants.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `PageNumber` | integer | Page number |
| `PageSize` | integer | Items per page |

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": 0,
      "fullName": "string",
      "email": "string",
      "phone": "string"
    }
  ],
  "pageNumber": 0,
  "totalPages": 0,
  "totalCount": 0,
  "hasPreviousPage": true,
  "hasNextPage": true
}
```

---

### POST `/api/Applicants`
Create a new applicant.

**Request Body** (`application/json`):
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "notes": "string"
}
```

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": 0
}
```
> `data` is the new applicant ID.

---

### PUT `/api/Applicants`
Update an existing applicant.

**Request Body** (`application/json`):
```json
{
  "id": 0,
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "notes": "string"
}
```

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": 0
}
```

---

### GET `/api/Applicants/{id}`
Get a single applicant by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`
```json
{
  "id": 0,
  "fullName": "string",
  "email": "string",
  "phone": "string"
}
```

---

### DELETE `/api/Applicants/{id}`
Delete an applicant by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": true
}
```

---

## 4. Deals

### GET `/api/Deals`
Retrieve a paginated, filterable list of deals.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `UnitId` | integer | Filter by unit |
| `ProjectId` | integer | Filter by project |
| `SortBy` | string | Field to sort by |
| `SortDirection` | string | `asc` or `desc` |
| `PageNumber` | integer | Page number |
| `PageSize` | integer | Items per page |

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": 0,
      "dealDate": "2026-05-04T16:42:52.158Z",
      "dealType": "string",
      "unit": {
        "unitId": 0,
        "unitName": "string",
        "price": 0,
        "area": 0,
        "isActive": true,
        "projectId": 0,
        "projectName": "string"
      },
      "unitDetails": {
        "unitDetailId": 0,
        "commissionRate": 0,
        "installmentMothes": 0,
        "installmentDownPayment": 0,
        "paymentType": "string",
        "status": "string"
      },
      "buyer": {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "dealDate": "2026-05-04T16:42:52.158Z",
        "dealLocation": "string"
      },
      "createdBy": "string",
      "createdAt": "2026-05-04T16:42:52.158Z",
      "updatedBy": "string",
      "updatedAt": "2026-05-04T16:42:52.158Z"
    }
  ],
  "pageNumber": 0,
  "totalPages": 0,
  "totalCount": 0,
  "hasPreviousPage": true,
  "hasNextPage": true
}
```

---

### POST `/api/Deals`
Create a new deal.

**Request Body** (`application/json`):
```json
{
  "unitPlanId": 0,
  "fullName": "string",
  "email": "string",
  "phone": "string"
}
```

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": 0
}
```
> `data` is the new deal ID.

---

### GET `/api/Deals/{id}`
Get a single deal by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK` — Returns a single `DealDetailsDto` object (same shape as the items array above).

---

### GET `/api/Deals/latest`
Get the latest deals (paginated).

**Query Parameters:**

| Name | Type | Default |
|------|------|---------|
| `pageNumber` | integer | 1 |
| `pageSize` | integer | 10 |

**Response:** `200 OK` — Paginated list of `DealDetailsDto`.

---

### GET `/api/Deals/unit/{unitId}`
Get all deals for a specific unit.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `unitId` | integer | ✅ |

**Query Parameters:** `pageNumber` (default: 1), `pageSize` (default: 10)

**Response:** `200 OK` — Paginated list of `DealDetailsDto`.

---

### GET `/api/Deals/unit/{unitId}/compatibility`
Get compatibility deals for a specific unit.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `unitId` | integer | ✅ |

**Query Parameters:** `pageNumber` (default: 1), `pageSize` (default: 10)

**Response:** `200 OK` — Paginated list of `DealDetailsDto`.

---

### GET `/api/Deals/project/{projectId}`
Get all deals for a specific project.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `projectId` | integer | ✅ |

**Query Parameters:** `pageNumber` (default: 1), `pageSize` (default: 10)

**Response:** `200 OK` — Paginated list of `DealDetailsDto`.

---

## 5. Developers

### GET `/api/Developers`
Retrieve a paginated list of developers.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `SearchKeyword` | string | Search by keyword |
| `Name` | string | Filter by name |
| `SortBy` | string | Field to sort by |
| `SortDescending` | boolean | Sort direction |
| `PageNumber` | integer | Page number |
| `PageSize` | integer | Items per page |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "id": 0,
        "name": "string",
        "logoImage": "string",
        "description": "string",
        "gallery": [
          { "id": 0, "imageUrl": "string" }
        ],
        "projects": [
          { "id": 0, "name": "string" }
        ],
        "createdBy": "string",
        "createdAt": "2026-05-04T16:42:52.178Z",
        "updatedBy": "string",
        "updatedAt": "2026-05-04T16:42:52.178Z"
      }
    ],
    "pageNumber": 0,
    "totalPages": 0,
    "totalCount": 0,
    "hasPreviousPage": true,
    "hasNextPage": true
  },
  "errors": "string"
}
```

---

### POST `/api/Developers`
Create a new developer.

**Request Body** (`application/json`):
```json
{
  "name": "string",
  "description": "string"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": 0,
  "errors": "string"
}
```
> `data` is the new developer ID.

---

### PUT `/api/Developers`
Update an existing developer.

**Request Body** (`application/json`):
```json
{
  "id": 0,
  "name": "string",
  "description": "string"
}
```

**Response:** `200 OK`

---

### GET `/api/Developers/{id}`
Get a single developer by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK` — Returns a single developer object wrapped in the standard API response.

---

### DELETE `/api/Developers/{id}`
Delete a developer by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`

---

### POST `/api/Developers/{id}/logo`
Upload or replace a developer's logo image.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Request Body** (`multipart/form-data`):

| Field | Type |
|-------|------|
| `file` | binary (image file) |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": "string",
  "errors": "string"
}
```
> `data` is the URL of the uploaded logo.

---

### DELETE `/api/Developers/{id}/logo`
Remove a developer's logo image.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`

---

### POST `/api/Developers/{id}/gallery`
Upload one or more gallery images for a developer.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Request Body** (`multipart/form-data`):

| Field | Type |
|-------|------|
| `files` | array of binary (image files) |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": ["string"],
  "errors": "string"
}
```
> `data` is an array of uploaded image URLs.

---

### DELETE `/api/Developers/gallery/{id}`
Delete a gallery image by its ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`

---

## 6. Facilities

### GET `/api/Facilities`
Get all facilities (no pagination).

**Response:** `200 OK`
```json
[
  { "id": 0, "name": "string" }
]
```

---

### POST `/api/Facilities`
Create a new facility with multilingual name.

**Request Body** (`application/json`):
```json
{
  "name": {
    "en": "string",
    "de": "string",
    "pl": "string"
  }
}
```

**Response:** `200 OK` — Returns the new facility ID (integer).

---

### PUT `/api/Facilities`
Update a facility.

**Request Body** (`application/json`):
```json
{
  "id": 0,
  "name": {
    "en": "string",
    "de": "string",
    "pl": "string"
  }
}
```

**Response:** `200 OK` — Returns the facility ID (integer).

---

### GET `/api/Facilities/{id}`
Get a single facility by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`
```json
{ "id": 0, "name": "string" }
```

---

### DELETE `/api/Facilities/{id}`
Delete a facility by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK` — Returns `true` on success.

---

## 7. Leads

### GET `/api/Leads`
Retrieve a paginated list of leads.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `UnitId` | integer | Filter by unit |
| `PageNumber` | integer | Page number |
| `PageSize` | integer | Items per page |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "id": 0,
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "projectName": "string",
        "unitId": 0,
        "propertyName": "string",
        "notes": "string",
        "statusLead": "string",
        "createdBy": "string",
        "createdAt": "2026-05-04T16:42:52.196Z",
        "updatedBy": "string",
        "updatedAt": "2026-05-04T16:42:52.196Z"
      }
    ],
    "pageNumber": 0,
    "totalPages": 0,
    "totalCount": 0,
    "hasPreviousPage": true,
    "hasNextPage": true
  },
  "errors": "string"
}
```

---

### POST `/api/Leads`
Create a new lead.

**Request Body** (`application/json`):
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "unitId": 0,
  "notes": "string"
}
```

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": 0
}
```
> `data` is the new lead ID.

---

### GET `/api/Leads/{id}`
Get a single lead by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK` — Returns a single lead object wrapped in the standard API response.

---

### PUT `/api/Leads/cancel/lead/{LeadId}`
Cancel a lead.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `LeadId` | integer | ✅ |

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"]
}
```

---

### PUT `/api/Leads/view/lead/{LeadId}`
Mark a lead as viewed.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `LeadId` | integer | ✅ |

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"]
}
```

---

## 8. Locations

### GET `/api/Locations`
Retrieve a paginated list of locations.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `PageNumber` | integer | Page number |
| `PageSize` | integer | Items per page |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "id": 0,
        "country": "string",
        "city": "string",
        "district": "string",
        "street": "string",
        "latitude": "string",
        "longitude": "string",
        "createdBy": "string",
        "createdAt": "2026-05-04T16:42:52.203Z",
        "updatedBy": "string",
        "updatedAt": "2026-05-04T16:42:52.203Z"
      }
    ],
    "pageNumber": 0,
    "totalPages": 0,
    "totalCount": 0,
    "hasPreviousPage": true,
    "hasNextPage": true
  },
  "errors": "string"
}
```

---

### POST `/api/Locations`
Create a new location with multilingual city/district.

**Request Body** (`application/json`):
```json
{
  "city": { "en": "string", "de": "string", "pl": "string" },
  "district": { "en": "string", "de": "string", "pl": "string" },
  "street": "string",
  "country": "string",
  "latitude": "string",
  "longitude": "string"
}
```

**Response:** `200 OK` — Returns the new location ID (integer).

---

### PUT `/api/Locations`
Update an existing location.

**Request Body** (`application/json`):
```json
{
  "id": 0,
  "city": { "en": "string", "de": "string", "pl": "string" },
  "district": { "en": "string", "de": "string", "pl": "string" },
  "street": "string",
  "country": "string",
  "latitude": "string",
  "longitude": "string"
}
```

**Response:** `200 OK` — Returns the location ID (integer).

---

### GET `/api/Locations/{id}`
Get a single location by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK` — Returns a single location object wrapped in the standard API response.

---

### DELETE `/api/Locations/{id}`
Delete a location by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK` — Returns `true` on success.

---

## 9. Payment Plans

### POST `/api/payment-plans`
Create a new payment plan for a unit.

**Request Body** (`application/json`):
```json
{
  "paymentType": "string",
  "unitId": 0,
  "installmentDownPayment": 0,
  "installmentYears": 0
}
```

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": 0
}
```
> `data` is the new payment plan ID.

---

### PUT `/api/payment-plans`
Update an existing payment plan.

**Request Body** (`application/json`):
```json
{
  "paymentPlanId": 0,
  "paymentType": "string",
  "status": 0,
  "installmentDownPayment": 0,
  "installmentYears": 0
}
```

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": true
}
```

---

### DELETE `/api/payment-plans/{id}`
Delete a payment plan by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": true
}
```

---

### GET `/api/payment-plans/unit/{unitId}`
Get all payment plans for a specific unit.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `unitId` | integer | ✅ |

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": [
    {
      "id": 0,
      "unitId": 0,
      "unitName": "string",
      "installmentDownPayment": 0,
      "installmentMonths": 0,
      "paymentType": "string",
      "unitStatus": "string",
      "createdBy": "string",
      "createdAt": "2026-05-04T16:42:52.214Z",
      "updatedBy": "string",
      "updatedAt": "2026-05-04T16:42:52.214Z"
    }
  ]
}
```

---

## 10. Projects

### GET `/api/Projects`
Retrieve a paginated list of projects.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `PageNumber` | integer | Page number |
| `PageSize` | integer | Items per page |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "developerId": 0,
        "developerName": "string",
        "locationId": 0,
        "locationName": "string",
        "imageUrls": ["string"],
        "facilities": ["string"],
        "createdBy": "string",
        "createdAt": "2026-05-04T16:42:52.215Z",
        "updatedBy": "string",
        "updatedAt": "2026-05-04T16:42:52.216Z"
      }
    ],
    "pageNumber": 0,
    "totalPages": 0,
    "totalCount": 0,
    "hasPreviousPage": true,
    "hasNextPage": true
  },
  "errors": "string"
}
```

---

### POST `/api/Projects`
Create a new project with multilingual name/description.

**Request Body** (`application/json`):
```json
{
  "name": { "en": "string", "de": "string", "pl": "string" },
  "description": { "en": "string", "de": "string", "pl": "string" },
  "facilityIds": [0],
  "developerId": 0,
  "locationId": 0
}
```

**Response:** `200 OK` — Returns the new project ID (integer).

---

### GET `/api/Projects/{id}`
Get a single project by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK` — Returns a single project object wrapped in the standard API response.

---

### PUT `/api/Projects/{id}`
Update an existing project by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`

---

### DELETE `/api/Projects/{id}`
Delete a project by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`

---

### POST `/api/Projects/{id}/images`
Upload images for a project.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Request Body** (`multipart/form-data`): Array of image files.

**Response:** `200 OK`

---

### DELETE `/api/Projects/{id}/deleteproject/images`
Delete a project image by URL.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `url` | string | URL of the image to delete |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": true,
  "errors": "string"
}
```

---

### POST `/api/Projects/AddUnitProject`
Add one or more units to a project.

**Request Body** (`application/json`):
```json
{
  "projectId": 0,
  "units": [
    {
      "name": { "en": "string", "de": "string", "pl": "string" },
      "description": { "en": "string", "de": "string", "pl": "string" },
      "price": 0,
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
      "servicesIds": [0]
    }
  ]
}
```

**Response:** `200 OK` — Returns the project ID (integer).

---

### PUT `/api/Projects/UpdateUnit`
Update a unit's details within a project.

**Request Body** (`application/json`):
```json
{
  "id": 0,
  "name": { "en": "string", "de": "string", "pl": "string" },
  "description": { "en": "string", "de": "string", "pl": "string" },
  "price": 0,
  "propertyType": 0,
  "noBathRoom": 0,
  "noBedRoom": 0,
  "noKitchen": 0,
  "floorName": "string",
  "isFeatured": true
}
```

**Response:** `200 OK` — Returns the unit ID (integer).

---

### DELETE `/api/Projects/DeleteUnit/{id}`
Delete a unit from a project.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK` — Returns the unit ID (integer).

---

### POST `/api/Projects/{id}/uploadUnit/images`
Upload images for a unit within a project.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ (unit ID) |

**Request Body** (`multipart/form-data`):

| Field | Type |
|-------|------|
| `files` | array of binary (image files) |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": ["string"],
  "errors": "string"
}
```
> `data` is an array of uploaded image URLs.

---

### DELETE `/api/Projects/{id}/deleteUnit/images`
Delete a unit image by URL.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ (unit ID) |

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `url` | string | URL of the image to delete |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": true,
  "errors": "string"
}
```

---

## 11. Requests

### GET `/api/Requests`
Retrieve a paginated list of requests, optionally filtered by status.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `PageNumber` | integer | Page number |
| `PageSize` | integer | Items per page |
| `Status` | integer | `0` = Pending, `1` = Approved, `2` = Rejected |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [
      {
        "id": 0,
        "unitName": "string",
        "applicantName": "string",
        "status": "string",
        "createdAt": "2026-05-04T16:42:52.230Z",
        "approvedAt": "2026-05-04T16:42:52.230Z"
      }
    ],
    "pageNumber": 0,
    "totalPages": 0,
    "totalCount": 0,
    "hasPreviousPage": true,
    "hasNextPage": true
  },
  "errors": "string"
}
```

---

### POST `/api/Requests`
Create a new request.

**Request Body** (`application/json`):
```json
{
  "unitName": "string",
  "applicantId": 0
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": 0,
  "errors": "string"
}
```
> `data` is the new request ID.

---

### GET `/api/Requests/{id}`
Get a single request by ID (full details).

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "unitId": 0,
    "unitName": "string",
    "unitPrice": 0,
    "unitArea": 0,
    "applicantId": 0,
    "applicantName": "string",
    "applicantEmail": "string",
    "applicantPhone": "string",
    "status": "string",
    "createdBy": "string",
    "createdAt": "2026-05-04T16:42:52.235Z",
    "updatedBy": "string",
    "updatedAt": "2026-05-04T16:42:52.235Z",
    "approvedBy": "string",
    "approvedAt": "2026-05-04T16:42:52.235Z"
  },
  "errors": "string"
}
```

---

### PUT `/api/Requests/approve`
Approve a request and assign a payment plan.

**Request Body** (`application/json`):
```json
{
  "id": 0,
  "paymentPlans": [
    {
      "commisionRate": 0,
      "installmentMoths": 0,
      "installmentDownPayment": 0,
      "paymentType": "string"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": true,
  "errors": "string"
}
```

---

### PUT `/api/Requests/{id}/reject`
Reject a request by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "string",
  "data": true,
  "errors": "string"
}
```

---

## 12. Services

### GET `/api/Services`
Get all services (no pagination).

**Response:** `200 OK`
```json
[
  { "id": 0, "name": "string" }
]
```

---

### POST `/api/Services`
Create a new service with multilingual name.

**Request Body** (`application/json`):
```json
{
  "name": {
    "en": "string",
    "de": "string",
    "pl": "string"
  }
}
```

**Response:** `200 OK` — Returns the new service ID (integer).

---

### PUT `/api/Services`
Update an existing service.

**Request Body** (`application/json`):
```json
{
  "id": 0,
  "name": {
    "en": "string",
    "de": "string",
    "pl": "string"
  }
}
```

**Response:** `200 OK` — Returns the service ID (integer).

---

### GET `/api/Services/{id}`
Get a single service by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`
```json
{ "id": 0, "name": "string" }
```

---

### DELETE `/api/Services/{id}`
Delete a service by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK` — Returns `true` on success.

---

## 13. Units

### GET `/api/Units`
Retrieve a filterable list of units.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `SearchTerm` | string | Full-text search |
| `MinPrice` | double | Minimum price filter |
| `MaxPrice` | double | Maximum price filter |
| `UnitType` | string | Filter by unit type |
| `ProjectId` | integer | Filter by project |
| `PageNumber` | integer | Page number |
| `PageSize` | integer | Items per page |

**Response:** `200 OK`
```json
[
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "price": 0,
    "area": 0,
    "noBathRoom": 0,
    "noBedRoom": 0,
    "noKitchen": 0,
    "floorName": "string",
    "floorNumber": 0,
    "unitType": "string",
    "unitStatus": "string",
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
    "imageUrls": ["string"],
    "services": ["string"],
    "createdBy": "string",
    "createdAt": "2026-05-04T16:42:52.246Z",
    "updatedBy": "string",
    "updatedAt": "2026-05-04T16:42:52.246Z"
  }
]
```

---

### GET `/api/Units/{id}`
Get a single unit by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK` — Returns a single unit object (same shape as the array items above).

---

### PUT `/api/Units/marksold`
Mark a unit as sold.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer | Unit ID |
| `Notes` | string | Optional notes |

**Response:** `200 OK`
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": true
}
```

---

## 14. Unit Soldout

### GET `/api/unit-soldout`
Retrieve a paginated list of sold-out units.

**Query Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `UnitName` | string | Filter by unit name |
| `SoldType` | string | Filter by sold type |
| `PageNumber` | integer | Page number |
| `PageSize` | integer | Items per page |

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": 0,
      "unitId": 0,
      "unitName": "string",
      "projectName": "string",
      "city": "string",
      "country": "string",
      "unitImages": ["string"],
      "soldoutDate": "2026-05-04T16:42:52.252Z",
      "soldType": "string",
      "notes": "string",
      "createdBy": "string",
      "createdAt": "2026-05-04T16:42:52.252Z"
    }
  ],
  "pageNumber": 0,
  "totalPages": 0,
  "totalCount": 0,
  "hasPreviousPage": true,
  "hasNextPage": true
}
```

---

### GET `/api/unit-soldout/{id}`
Get a single sold-out unit record by ID.

**Path Parameters:**

| Name | Type | Required |
|------|------|----------|
| `id` | integer | ✅ |

**Response:** `200 OK`
```json
{
  "id": 0,
  "unitId": 0,
  "unitName": "string",
  "projectName": "string",
  "city": "string",
  "country": "string",
  "unitImages": ["string"],
  "soldoutDate": "2026-05-04T16:42:52.253Z",
  "soldType": "string",
  "notes": "string",
  "createdBy": "string",
  "createdAt": "2026-05-04T16:42:52.253Z"
}
```

---

## Common Response Patterns

### Paginated List
```json
{
  "items": [...],
  "pageNumber": 0,
  "totalPages": 0,
  "totalCount": 0,
  "hasPreviousPage": true,
  "hasNextPage": true
}
```

### Operation Result (simple)
```json
{
  "succeeded": true,
  "errors": ["string"],
  "data": 0
}
```

### API Response Wrapper (used on Developers, Leads, Locations, Projects, Requests)
```json
{
  "success": true,
  "message": "string",
  "data": { ... },
  "errors": "string"
}
```

### Multilingual Field
Several create/update endpoints accept multilingual name/description fields in this shape:
```json
{
  "en": "string",
  "de": "string",
  "pl": "string"
}
```
> Supported languages: English (`en`), German (`de`), Polish (`pl`).

---

## Notes

- All `DELETE` and write operations are protected and require a valid JWT token.
- Timestamps are returned in ISO 8601 format (UTC).
- `createdBy` / `updatedBy` fields are auto-populated by the server from the authenticated user.
- The `status` field on Requests maps to: `0` = Pending, `1` = Approved, `2` = Rejected.
- File uploads use `multipart/form-data`; all other requests use `application/json`.
