# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

---

## Emergency Endpoints

### Create Emergency Request

**POST** `/emergency/request`

Creates a new emergency request and notifies nearby helpers via SMS.

**Public Endpoint** (No auth required)

**Request Body:**

```json
{
  "userName": "Jane Doe",
  "userPhone": "+1234567890",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006,
    "address": "123 Main St, New York, NY"
  },
  "emergencyType": "safety",
  "description": "Need immediate assistance",
  "priority": "high"
}
```

**Emergency Types:** `safety`, `violence`, `medical`, `accident`, `other`
**Priority Levels:** `low`, `medium`, `high`, `critical`

**Response:**

```json
{
  "success": true,
  "message": "Emergency request created and notifications sent",
  "data": {
    "requestId": "64abc123...",
    "status": "pending",
    "notifiedCount": {
      "ngos": 2,
      "volunteers": 5,
      "total": 7
    },
    "nearbyHelpers": {
      "ngos": 2,
      "volunteers": 5
    }
  }
}
```

---

### Get All Emergency Requests

**GET** `/emergency/requests`

**Protected Endpoint** (Requires auth)

**Query Parameters:**

- `status` (optional): Filter by status (pending, acknowledged, in-progress, resolved, cancelled)
- `emergencyType` (optional): Filter by type
- `limit` (optional): Number of results (default: 50)
- `page` (optional): Page number (default: 1)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64abc123...",
      "userName": "Jane Doe",
      "userPhone": "+1234567890",
      "location": {
        "type": "Point",
        "coordinates": [-74.0060, 40.7128],
        "address": "123 Main St, New York, NY"
      },
      "emergencyType": "safety",
      "description": "Need immediate assistance",
      "status": "pending",
      "priority": "high",
      "notifiedNGOs": [...],
      "notifiedVolunteers": [...],
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

---

### Get Emergency Request by ID

**GET** `/emergency/requests/:id`

**Protected Endpoint**

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "userName": "Jane Doe"
    // ... full request details with populated NGOs and volunteers
  }
}
```

---

### Update Emergency Request Status

**PATCH** `/emergency/requests/:id/status`

**Protected Endpoint**

**Request Body:**

```json
{
  "status": "in-progress",
  "notes": "Help is on the way",
  "assignedTo": "ngo_id or volunteer_id"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Emergency request updated successfully",
  "data": {
    // Updated request object
  }
}
```

---

### Get Emergency Statistics

**GET** `/emergency/stats`

**Protected Endpoint**

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 10,
    "inProgress": 5,
    "resolved": 135,
    "last24Hours": 12,
    "byType": [
      { "_id": "safety", "count": 50 },
      { "_id": "medical", "count": 30 },
      { "_id": "violence", "count": 40 },
      { "_id": "accident", "count": 20 },
      { "_id": "other", "count": 10 }
    ]
  }
}
```

---

## NGO Endpoints

### Register NGO

**POST** `/ngos/register`

**Public Endpoint**

**Request Body:**

```json
{
  "organizationName": "Safety First NGO",
  "registrationNumber": "REG12345",
  "contactPerson": {
    "name": "John Smith",
    "designation": "Director"
  },
  "phone": "+1234567890",
  "alternatePhone": "+1234567891",
  "email": "contact@safetyfirst.org",
  "location": {
    "longitude": -74.006,
    "latitude": 40.7128,
    "address": "456 NGO St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001"
  },
  "serviceArea": {
    "radiusKm": 15,
    "cities": ["New York", "Brooklyn"]
  },
  "services": ["medical", "legal", "shelter"],
  "capacity": {
    "maxCapacity": 20
  }
}
```

**Services:** `medical`, `legal`, `shelter`, `counseling`, `emergency-transport`, `food`, `other`

---

### Get All NGOs

**GET** `/ngos`

**Protected Endpoint**

**Query Parameters:**

- `availability`: Filter by availability (available, busy, unavailable)
- `services`: Filter by service type
- `verified`: Filter by verification status (true/false)
- `limit`: Number of results (default: 50)

---

### Find Nearby NGOs

**GET** `/ngos/nearby`

**Public Endpoint**

**Query Parameters:**

- `longitude` (required): User longitude
- `latitude` (required): User latitude
- `maxDistance`: Search radius in km (default: 50)
- `services`: Filter by service type

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64abc...",
      "organizationName": "Safety First NGO",
      "phone": "+1234567890",
      "location": {...},
      "services": ["medical", "legal"],
      "availability": "available"
    }
  ],
  "count": 3
}
```

---

### Update NGO

**PATCH** `/ngos/:id`

**Protected Endpoint**

**Request Body:** (All fields optional)

```json
{
  "availability": "busy",
  "capacity": {
    "currentLoad": 5,
    "maxCapacity": 20
  }
}
```

---

### Delete NGO (Soft Delete)

**DELETE** `/ngos/:id`

**Protected Endpoint**

Sets `isActive` to false instead of deleting.

---

## Volunteer Endpoints

### Register Volunteer

**POST** `/volunteers/register`

**Public Endpoint**

**Request Body:**

```json
{
  "name": "Sarah Johnson",
  "phone": "+1234567890",
  "email": "sarah@email.com",
  "age": 28,
  "gender": "female",
  "location": {
    "longitude": -74.006,
    "latitude": 40.7128,
    "address": "789 Vol St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001"
  },
  "availableRadius": 5,
  "skills": ["first-aid", "counseling"],
  "idProof": "DL123456",
  "emergencyContact": {
    "name": "Mike Johnson",
    "phone": "+1234567899",
    "relation": "Spouse"
  }
}
```

**Skills:** `first-aid`, `counseling`, `driving`, `language-translation`, `legal-knowledge`, `medical`, `other`

---

### Get All Volunteers

**GET** `/volunteers`

**Protected Endpoint**

**Query Parameters:**

- `availability`: available, busy, unavailable
- `skills`: Filter by skill
- `verified`: true/false
- `limit`: Number of results (default: 50)

---

### Find Nearby Volunteers

**GET** `/volunteers/nearby`

**Public Endpoint**

**Query Parameters:**

- `longitude` (required)
- `latitude` (required)
- `maxDistance`: Search radius in km (default: 50)
- `skills`: Filter by skill

---

### Update Volunteer

**PATCH** `/volunteers/:id`

**Protected Endpoint**

**Request Body:** (All fields optional)

```json
{
  "availability": "available",
  "location": {
    "longitude": -74.007,
    "latitude": 40.713
  }
}
```

---

### Delete Volunteer (Soft Delete)

**DELETE** `/volunteers/:id`

**Protected Endpoint**

---

## Authentication Endpoints

### Login

**POST** `/auth/login`

**Public Endpoint**

**Request Body:**

```json
{
  "email": "admin@controlroom.com",
  "password": "your_password"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "64abc...",
      "email": "admin@controlroom.com",
      "name": "Control Room Admin",
      "role": "operator"
    }
  }
}
```

**Token expires in 7 days**

---

### Verify Token

**GET** `/auth/verify`

**Protected Endpoint**

**Response:**

```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "64abc...",
      "email": "admin@controlroom.com",
      "name": "Control Room Admin",
      "role": "operator"
    }
  }
}
```

---

### Create Admin

**POST** `/auth/create-admin`

**Public Endpoint** (Should be protected in production!)

**Request Body:**

```json
{
  "email": "newadmin@controlroom.com",
  "password": "secure_password",
  "name": "New Admin",
  "role": "operator"
}
```

**Roles:** `super-admin`, `operator`, `viewer`

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (only in development mode)"
}
```

**Common HTTP Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `404`: Not Found
- `500`: Internal Server Error

---

## Testing with cURL

### Create Emergency Request

```bash
curl -X POST http://localhost:5000/api/emergency/request \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Test User",
    "userPhone": "+1234567890",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "emergencyType": "safety",
    "description": "Test emergency",
    "priority": "high"
  }'
```

### Login and Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@controlroom.com",
    "password": "your_password"
  }'
```

### Get All Requests (with auth)

```bash
curl http://localhost:5000/api/emergency/requests \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
