# NGO & Volunteer Responder App - Complete Guide

## System Overview

This system connects emergency victims with nearby NGOs and Volunteers. When a user sends an emergency signal, the system automatically notifies nearby responders who can then accept or reject the request through their mobile app.

## Architecture

### Backend (Node.js/Express)

- **Location**: `c:\Users\Asus\mahila app\server\`
- **Port**: 5000
- **Database**: MongoDB

### Mobile App (React Native/Expo)

- **Location**: `c:\Users\Asus\mahila app\responder-app\`
- **Platform**: iOS, Android, Web
- **Framework**: Expo with React Navigation

## Backend Updates

### New Features Added

1. **Danger Levels** in Emergency Requests:

   - `normal` - Low risk situations
   - `moderate` - Medium urgency
   - `critical` - Life-threatening emergencies

2. **Response Tracking**:

   - Each notified NGO/Volunteer can accept or reject requests
   - Response status tracked individually
   - Timestamps for all responses

3. **Authentication for NGOs/Volunteers**:

   - Email/password login
   - JWT tokens with 30-day expiration
   - Separate user types in token payload

4. **New API Endpoints**:
   ```
   POST /api/ngos/login
   POST /api/volunteers/login
   GET  /api/ngos/my/requests
   GET  /api/volunteers/my/requests
   POST /api/ngos/requests/:id/accept
   POST /api/ngos/requests/:id/reject
   POST /api/volunteers/requests/:id/accept
   POST /api/volunteers/requests/:id/reject
   ```

## Mobile App Features

### 1. Login Screen

- **Account Type Selection**: Toggle between NGO and Volunteer
- **Email/Password**: Secure authentication
- **Auto-save**: Remembers login for 30 days

### 2. Requests List Screen

- **Auto-refresh**: Updates every 30 seconds
- **Pull to refresh**: Manual refresh option
- **Danger Level Indicators**:
  - 🚨 Critical (Red)
  - ⚠️ Moderate (Orange)
  - ✓ Normal (Green)
- **Status Badges**: PENDING, ACCEPTED, REJECTED
- **Filters**: View All, Pending, or Accepted requests
- **Quick Info**: Name, type, description, blood type, location, time

### 3. Request Detail Screen

- **Victim Information**:
  - Name and phone (tap to call)
  - Medical info (blood type, conditions, allergies)
  - Emergency contacts with quick call
- **Location**:
  - Interactive map showing exact location
  - Navigate button (opens Google Maps/Apple Maps)
  - Full address
- **Actions**:
  - **Accept**: Take responsibility to respond
  - **Reject**: Decline with optional reason
- **Real-time Status**: Shows your current response status

## Getting Started

### Step 1: Start Backend Server

```bash
cd "c:\Users\Asus\mahila app"
npm run dev
```

Backend will run on http://localhost:5000

### Step 2: Create Test Accounts

#### Create NGO Account:

```bash
# Use Postman or curl
POST http://localhost:5000/api/ngos/register
Content-Type: application/json

{
  "organizationName": "Emergency Medical Services",
  "email": "ems@ngo.com",
  "password": "password123",
  "phone": "+1234567890",
  "registrationNumber": "NGO001",
  "location": {
    "longitude": -122.4194,
    "latitude": 37.7749,
    "address": "123 Main St, San Francisco, CA"
  },
  "services": ["medical", "emergency-transport"],
  "contactPerson": {
    "name": "John Doe",
    "designation": "Director"
  }
}
```

#### Create Volunteer Account:

```bash
POST http://localhost:5000/api/volunteers/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@volunteer.com",
  "password": "password123",
  "phone": "+1234567890",
  "location": {
    "longitude": -122.4194,
    "latitude": 37.7749,
    "address": "456 Oak St, San Francisco, CA"
  },
  "skills": ["first-aid", "driving"],
  "age": 28,
  "gender": "female"
}
```

### Step 3: Update Mobile App API URL

Edit `responder-app/src/services/api.js`:

```javascript
// Find your computer's IP address:
// Windows: ipconfig (look for IPv4 Address)
// Mac/Linux: ifconfig (look for inet)

const API_URL = "http://YOUR_IP_ADDRESS:5000/api";
// Example: 'http://192.168.1.100:5000/api'
```

### Step 4: Start Mobile App

```bash
cd "c:\Users\Asus\mahila app\responder-app"
npm start
```

Scan the QR code with Expo Go app on your phone.

### Step 5: Login to Mobile App

1. Open app on your phone
2. Select **NGO** or **Volunteer**
3. Enter credentials:
   - Email: `ems@ngo.com` or `jane@volunteer.com`
   - Password: `password123`
4. Tap **Login**

### Step 6: Test Emergency Flow

#### Create Test Emergency (from backend):

```bash
POST http://localhost:5000/api/emergency/signal
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "location": {
    "longitude": -122.4194,
    "latitude": 37.7749,
    "address": "Emergency location near responders"
  },
  "emergencyType": "medical",
  "description": "Person collapsed, needs immediate help!",
  "dangerLevel": "critical"
}
```

The mobile app will show this request within 30 seconds (or immediately after pull-to-refresh).

## Workflow

```
1. User in Distress
   ↓
2. Sends Emergency Signal (with live location)
   ↓
3. Backend finds nearby NGOs/Volunteers
   ↓
4. Sends SMS + Creates Request Records
   ↓
5. Mobile App Shows Request (with danger level)
   ↓
6. NGO/Volunteer Reviews Details
   ↓
7. Accepts or Rejects Request
   ↓
8. If Accepted: Navigate to Location & Help
```

## Database Schema Changes

### EmergencyRequest Model Updates:

```javascript
{
  dangerLevel: {
    type: String,
    enum: ["normal", "moderate", "critical"],
    default: "moderate"
  },
  notifiedNGOs: [{
    ngoId: ObjectId,
    notifiedAt: Date,
    status: String, // 'sent', 'failed'
    responseStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    respondedAt: Date
  }],
  notifiedVolunteers: [{
    volunteerId: ObjectId,
    notifiedAt: Date,
    status: String,
    responseStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    respondedAt: Date
  }],
  userMedicalInfo: {
    bloodType: String,
    medicalConditions: String,
    allergies: String
  },
  userEmergencyContacts: [{
    name: String,
    relationship: String,
    phone: String
  }]
}
```

### NGO Model Updates:

```javascript
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 }
}
```

### Volunteer Model Updates:

```javascript
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 }
}
```

## Security

- **Passwords**: Hashed with bcrypt (10 salt rounds)
- **JWT Tokens**: 30-day expiration
- **User Types**: Embedded in token (`ngo`, `volunteer`, `user`, `admin`)
- **Secure Storage**: AsyncStorage for mobile tokens
- **HTTPS**: Recommended for production

## Tips & Best Practices

### For NGOs:

1. Keep app running in background for quick notifications
2. Accept requests only if you can respond immediately
3. Call victim before navigating to assess situation
4. Update your availability status when capacity is full

### For Volunteers:

1. Only accept if within reasonable travel distance
2. Inform emergency contact before responding
3. Bring first-aid kit if you have medical skills
4. Stay safe - call police for dangerous situations

### For Admins:

1. Verify NGOs and Volunteers before activating accounts
2. Set appropriate service areas and radius
3. Monitor response times and ratings
4. Remove inactive or unresponsive helpers

## Troubleshooting

### "Cannot connect to server"

- Check if backend is running (`npm run dev`)
- Verify API_URL uses computer's IP, not localhost
- Ensure phone and computer on same WiFi network
- Check Windows Firewall allows port 5000

### "Invalid credentials"

- Verify account is created (check MongoDB)
- Ensure `verified: true` in database
- Check `isActive: true` for account
- Password must be at least 6 characters

### "No requests showing"

- Check if emergency requests exist in database
- Verify NGO/Volunteer was notified (check `notifiedNGOs` array)
- Pull down to refresh manually
- Check backend logs for errors

### Maps not working

- Enable location permissions on phone
- Maps work in Expo Go automatically
- For production, add Google Maps API key

## Next Steps

1. **Add Push Notifications**:

   - Use Expo Notifications
   - Send instant alerts for new emergencies

2. **Real-time Updates**:

   - Implement Socket.io
   - Live status updates

3. **Offline Support**:

   - Cache requests locally
   - Queue responses when offline

4. **Performance Tracking**:
   - Response time metrics
   - Success rate tracking
   - User ratings

## Support

For issues or questions:

1. Check backend console logs
2. Check mobile app console (shake device → Debug)
3. Verify MongoDB connection
4. Check API endpoint responses in Postman

## Summary

You now have a complete emergency response system where:

- ✅ Users can register and send emergency signals
- ✅ NGOs and Volunteers receive notifications
- ✅ Mobile app shows requests with danger levels
- ✅ Responders can accept/reject with one tap
- ✅ Integrated maps for navigation
- ✅ Medical info display for better response
- ✅ Emergency contacts accessible
- ✅ Real-time status tracking

The system is ready for testing and can be enhanced with additional features as needed!
