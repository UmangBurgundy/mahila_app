# Emergency Response Control Room System

A real-time emergency response system that connects users in distress with nearby NGOs and volunteers through a centralized control room.

## 🎯 Features

- **User Emergency Requests**: Users can send emergency requests with their real-time location
- **Automatic Location-Based Matching**: System finds nearby NGOs and volunteers within configurable radius
- **SMS Notifications**: Automatic SMS alerts sent to nearby helpers with user location details
- **Control Room Dashboard**: Real-time monitoring and management of all emergency requests
- **NGO & Volunteer Management**: Register and manage responder organizations and volunteers
- **Geographic Tracking**: View all requests and responders on an interactive map

## 🏗️ Architecture

### Backend (Node.js/Express)

- RESTful API for emergency requests, NGO/volunteer management
- MongoDB for data persistence
- Geospatial queries for proximity matching
- Twilio integration for SMS notifications
- JWT authentication for control room access

### Mobile App (Expo/React Native)

- **Native iOS and Android apps**
- User-facing emergency request interface with geolocation
- Control room dashboard for operators
- Push notifications for real-time alerts
- Offline support and background location tracking

### Frontend (React Web - Optional)

- Control Room Dashboard for operators
- User-facing emergency request interface
- Real-time map visualization
- Responsive design for mobile and desktop

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Twilio account for SMS (get free trial at https://www.twilio.com)

## 🚀 Quick Start

### 1. Installation

#### Backend Only:

```bash
# Install backend dependencies
npm install
```

#### Mobile App (Recommended):

```bash
# Install mobile app dependencies
cd mobile
npm install
```

#### Web Frontend (Optional):

```bash
# Install web frontend dependencies
cd client
npm install
```

### 2. Configuration

```bash
# Copy environment template
copy .env.example .env

# Edit .env and add your credentials
# - MongoDB connection string
# - Twilio credentials
# - Admin password
```

### 3. Database Setup

```bash
# Start MongoDB locally or use MongoDB Atlas
# Connection string in .env: MONGODB_URI
```

### 4. Run Application

#### Option A: Mobile App (Recommended)

```bash
# Start backend
npm run dev

# In another terminal, start mobile app
cd mobile
npm start
```

Then:

- Scan QR code with Expo Go app on your phone
- Press 'a' for Android emulator
- Press 'i' for iOS simulator

#### Option B: Web Frontend

```bash
# Development mode (both backend and frontend)
npm run dev:full

# Or run separately:
# Backend: npm run dev
# Frontend: npm run client
```

Access the web application:

- Control Room Dashboard: http://localhost:3000/dashboard
- User Interface: http://localhost:3000
- API: http://localhost:5000/api

## 📱 How It Works

### For Users in Emergency:

1. Open the app and click "Request Help"
2. Allow location access
3. Describe the emergency
4. System automatically finds nearby helpers
5. SMS sent to NGOs/volunteers with your location

### For Control Room:

1. Login to dashboard
2. Monitor incoming requests in real-time
3. View requests on map
4. Manage NGOs and volunteers
5. Track response status

### For NGOs/Volunteers:

1. Register with the control room
2. Receive SMS alerts when nearby user needs help
3. Location link included in SMS
4. Respond to help those in need

## 🗂️ Project Structure

```
emergency-response-system/
├── server/                 # Backend code
│   ├── config/            # Database & configuration
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── controllers/       # Business logic
│   ├── middleware/        # Authentication, validation
│   ├── services/          # Location matching, SMS
│   └── index.js           # Server entry point
├── mobile/                # 📱 Expo React Native app (MAIN APP)
│   ├── screens/           # Mobile screens
│   │   ├── EmergencyRequestScreen.js
│   │   ├── DashboardScreen.js
│   │   └── LoginScreen.js
│   ├── services/          # API calls
│   ├── App.js             # Main app with navigation
│   ├── app.json           # Expo configuration
│   └── package.json
├── client/                # Web React app (optional)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API calls
│   │   └── App.js
│   └── package.json
├── .env.example           # Environment template
└── package.json           # Backend dependencies
```

## 🔌 API Endpoints

### Emergency Requests

- `POST /api/emergency/request` - Create new emergency request
- `GET /api/emergency/requests` - Get all requests (admin)
- `GET /api/emergency/requests/:id` - Get request details
- `PATCH /api/emergency/requests/:id/status` - Update request status

### NGOs

- `POST /api/ngos/register` - Register NGO
- `GET /api/ngos` - List all NGOs
- `GET /api/ngos/nearby` - Find NGOs near location
- `PATCH /api/ngos/:id` - Update NGO details

### Volunteers

- `POST /api/volunteers/register` - Register volunteer
- `GET /api/volunteers` - List all volunteers
- `GET /api/volunteers/nearby` - Find volunteers near location
- `PATCH /api/volunteers/:id` - Update volunteer details

### Authentication

- `POST /api/auth/login` - Control room login
- `POST /api/auth/verify` - Verify JWT token

## 🔐 Security

- JWT authentication for control room access
- Phone number verification for NGOs/volunteers
- Rate limiting on emergency request endpoints
- Input validation and sanitization
- Helmet.js for security headers

## 🛠️ Configuration

Edit `.env` file:

- `MAX_SEARCH_RADIUS_KM`: Maximum distance to search for helpers (default: 50km)
- `MAX_VOLUNTEERS_TO_NOTIFY`: Max volunteers to notify per request (default: 5)
- `MAX_NGOS_TO_NOTIFY`: Max NGOs to notify per request (default: 3)

## 📊 Database Schema

### EmergencyRequest

- User details (name, phone, location)
- Emergency type & description
- Status (pending, acknowledged, resolved)
- Timestamp & assigned helpers

### NGO

- Organization name & registration number
- Contact details & location
- Service areas & capacity

### Volunteer

- Personal details & phone number
- Location & availability status
- Skills & verified status

## 🤝 Contributing

Contributions welcome! This system helps save lives.

## 📄 License

MIT License - Feel free to use for humanitarian purposes
