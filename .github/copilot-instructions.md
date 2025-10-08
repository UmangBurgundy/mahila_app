# Emergency Response Control Room System - AI Coding Agent Instructions

## Project Overview

This is an emergency response coordination system that connects users in distress with nearby NGOs and volunteers through a centralized control room. When a user sends an emergency request, the system automatically finds and notifies verified helpers within a configurable radius via SMS.

## Architecture

### Backend (Node.js/Express)

- **Framework**: Express.js with MongoDB (Mongoose ODM)
- **Authentication**: JWT tokens for control room operators
- **Location Services**: MongoDB geospatial queries (`2dsphere` index) + geolib for distance calculations
- **SMS Integration**: Twilio API for emergency notifications
- **Security**: Helmet.js, bcryptjs for password hashing, CORS enabled

### Frontend (React)

- **User Interface**: Emergency request form with geolocation
- **Control Room Dashboard**: Real-time monitoring of all requests with status updates
- **Authentication**: Protected routes with JWT stored in localStorage
- **Styling**: Custom CSS with responsive design

### Database Schema

- **EmergencyRequest**: User details, location (GeoJSON Point), status, priority, notified helpers
- **NGO**: Organization info, location, services, availability, capacity
- **Volunteer**: Personal info, location, skills, availability
- **Admin**: Control room operators with role-based access

## Key Workflows

### Emergency Request Flow

1. User submits request with geolocation via `/api/emergency/request` (public endpoint)
2. System uses `findNearbyHelpers()` to query NGOs/Volunteers within radius using `$near` operator
3. `sendBulkEmergencySMS()` sends SMS to all found helpers via Twilio
4. Request saved with `notifiedNGOs` and `notifiedVolunteers` arrays
5. Control room can update status: pending → acknowledged → in-progress → resolved

### Location Matching Logic

- MongoDB `2dsphere` index on `location.coordinates` [longitude, latitude]
- Search radius configurable via `MAX_SEARCH_RADIUS_KM` env var (default: 50km)
- Limits: `MAX_VOLUNTEERS_TO_NOTIFY` and `MAX_NGOS_TO_NOTIFY` per request
- Uses `$maxDistance` in meters for geospatial queries
- See `server/services/locationService.js`

### SMS Notifications

- Twilio initialized in `server/services/smsService.js`
- Messages include: user details, emergency type, Google Maps link
- Falls back to simulation mode if Twilio not configured
- Status tracked per helper in request document

## Project-Specific Conventions

### API Response Format

All API responses follow this structure:

```javascript
{
  success: boolean,
  message: string,
  data: object,
  error?: string  // Only on errors
}
```

### Location Data Format

Always use GeoJSON format with [longitude, latitude] order:

```javascript
location: {
  type: 'Point',
  coordinates: [longitude, latitude],  // [lng, lat] order is critical!
  address: string
}
```

### Environment Variables

Required in `.env`:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: For SMS
- `MAX_SEARCH_RADIUS_KM`, `MAX_VOLUNTEERS_TO_NOTIFY`, `MAX_NGOS_TO_NOTIFY`: Tuning params

### Protected vs Public Routes

- **Public**: `/api/emergency/request`, `/api/ngos/register`, `/api/volunteers/register`, `/api/ngos/nearby`, `/api/volunteers/nearby`
- **Protected** (require JWT): All dashboard routes (GET requests, status updates, management)

## Development Commands

### Initial Setup

```bash
# Install dependencies
npm run install:all

# Copy and configure environment
copy .env.example .env
# Edit .env with your MongoDB URI and Twilio credentials

# Create initial admin (run once)
# POST to /api/auth/create-admin with { email, password, name, role }
```

### Running the App

```bash
# Full stack (backend + frontend concurrently)
npm run dev:full

# Backend only (port 5000)
npm run dev

# Frontend only (port 3000)
npm run client
```

### Key URLs

- Frontend: http://localhost:3000
- Control Room: http://localhost:3000/dashboard (requires login)
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## Common Tasks

### Adding a New Status to Emergency Requests

1. Update enum in `server/models/EmergencyRequest.js`
2. Add UI button in `client/src/components/Dashboard.js`
3. Add CSS class in `Dashboard.css` for status badge

### Adding New Emergency Types

1. Update enum in `EmergencyRequest` model
2. Add option in `EmergencyRequestForm.js` select dropdown
3. Optionally filter NGOs by matching service types in `emergencyController.js`

### Adjusting Search Radius

- Change `MAX_SEARCH_RADIUS_KM` in `.env` (affects all requests)
- Or pass `maxRadius` parameter to `findNearbyHelpers()` function

### Testing SMS Without Twilio

- Leave `TWILIO_*` env vars empty
- System falls back to simulation mode (logs to console)
- Check `smsService.js` for simulated responses

## Integration Points

### MongoDB Geospatial Queries

- Requires `2dsphere` index (automatically created in models)
- Use `$near` operator with `$geometry` for proximity searches
- Distance units: meters (convert km → meters before query)

### Twilio SMS API

- Initialized in `server/index.js` on startup
- Handles errors gracefully (continues without SMS if fails)
- Message template in `smsService.js` includes Google Maps link

### Frontend ↔ Backend Communication

- Axios instance in `client/src/services/api.js`
- JWT token auto-attached via interceptor
- All API calls use async/await with try/catch

## Critical Files to Know

### Backend Core

- `server/index.js`: Main server entry, middleware setup, route mounting
- `server/controllers/emergencyController.js`: Core logic for request creation and helper notification
- `server/services/locationService.js`: Geospatial matching algorithm
- `server/services/smsService.js`: Twilio SMS sending

### Frontend Core

- `client/src/components/EmergencyRequestForm.js`: User-facing emergency request UI
- `client/src/components/Dashboard.js`: Control room operator dashboard
- `client/src/services/api.js`: API client with auth interceptor

### Models (Database Schemas)

- `server/models/EmergencyRequest.js`: Main request entity with geospatial index
- `server/models/NGO.js`: Organization responders
- `server/models/Volunteer.js`: Individual responders
- `server/models/Admin.js`: Control room operators

## Debugging Tips

### Location Not Working

- Check browser console for geolocation errors
- Verify HTTPS (geolocation requires secure context)
- Check MongoDB geospatial index: `db.emergencyrequests.getIndexes()`

### SMS Not Sending

- Verify Twilio credentials in `.env`
- Check console for initialization errors
- Test phone number format (E.164: +1234567890)
- Check Twilio console for API logs

### No Helpers Found

- Verify NGOs/Volunteers have `verified: true` and `isActive: true`
- Check `availability` field (must not be 'unavailable')
- Increase `MAX_SEARCH_RADIUS_KM` to expand search
- Use MongoDB Compass to verify location indexes

## Security Considerations

- All passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens expire in 7 days
- Helmet.js adds security headers
- Input validation using express-validator (can be enhanced)
- Control room routes protected by `authMiddleware`

## Future Enhancement Areas

- Real-time updates (WebSockets/Socket.io)
- Mobile app (React Native)
- Map visualization in dashboard (react-leaflet)
- Push notifications for helpers
- Analytics and reporting
- Multi-language support
