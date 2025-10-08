# Setup Guide

Complete guide to setting up and running the Emergency Response Control Room System.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - Choose one:
  - Local installation: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **Git** (optional, for cloning)

## Step 1: Get the Code

If you cloned from a repository:

```bash
cd "mahila app"
```

## Step 2: Install Dependencies

Install both backend and frontend dependencies:

```bash
npm run install:all
```

Or install separately:

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

## Step 3: MongoDB Setup

### Option A: Local MongoDB

1. Start MongoDB service:

   - **Windows**: Open Services → Start "MongoDB Server"
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

2. Verify MongoDB is running:
   ```bash
   mongosh
   ```
   You should see a connection message. Type `exit` to quit.

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Sandbox - Free)
4. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose Password authentication
   - Save username and password
5. Whitelist your IP:
   - Go to Network Access
   - Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Step 4: Twilio Setup (SMS Service)

1. Go to [Twilio](https://www.twilio.com/)
2. Sign up for a free account (includes $15 credit)
3. Get a Twilio phone number:
   - Go to Phone Numbers → Manage → Buy a number
   - Choose a number (free trial allows one number)
4. Get your credentials:
   - Go to Account → Dashboard
   - Copy **Account SID** and **Auth Token**

**Note:** Without Twilio, the app will work but SMS won't be sent (will show in console instead).

## Step 5: Environment Configuration

1. Copy the example environment file:

   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file with your details:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/emergency-response

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/emergency-response?retryWrites=true&w=majority

# JWT Secret (change this to a random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Location Settings
MAX_SEARCH_RADIUS_KM=50
MAX_VOLUNTEERS_TO_NOTIFY=5
MAX_NGOS_TO_NOTIFY=3

# Admin Credentials
ADMIN_EMAIL=admin@controlroom.com
ADMIN_PASSWORD=change_this_password_now
```

**Important:** Change the `JWT_SECRET` and `ADMIN_PASSWORD` before deploying!

## Step 6: Create Initial Admin Account

You need at least one admin account to access the control room dashboard.

### Option A: Using API

1. Start the server (see Step 7)
2. Send a POST request to create admin:

**Using cURL:**

```bash
curl -X POST http://localhost:5000/api/auth/create-admin -H "Content-Type: application/json" -d "{\"email\": \"admin@controlroom.com\", \"password\": \"SecurePassword123\", \"name\": \"Control Room Admin\", \"role\": \"super-admin\"}"
```

**Using Postman:**

- Method: POST
- URL: `http://localhost:5000/api/auth/create-admin`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "email": "admin@controlroom.com",
  "password": "SecurePassword123",
  "name": "Control Room Admin",
  "role": "super-admin"
}
```

### Option B: Using MongoDB Directly

1. Open MongoDB shell:

   ```bash
   mongosh
   ```

2. Switch to your database:

   ```javascript
   use emergency-response
   ```

3. Create admin user:
   ```javascript
   db.admins.insertOne({
     email: "admin@controlroom.com",
     password: "$2a$10$XYZ...", // Use a bcrypt hash
     name: "Control Room Admin",
     role: "super-admin",
     isActive: true,
     createdAt: new Date(),
     updatedAt: new Date(),
   });
   ```

## Step 7: Run the Application

### Development Mode (Recommended for testing)

Run both backend and frontend simultaneously:

```bash
npm run dev:full
```

This will start:

- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Run Separately

**Backend only:**

```bash
npm run dev
```

**Frontend only (in a new terminal):**

```bash
npm run client
```

### Production Mode

```bash
# Build frontend
cd client
npm run build
cd ..

# Start backend (serves built frontend)
npm start
```

## Step 8: Access the Application

Open your browser and navigate to:

- **User Emergency Request Form**: http://localhost:3000
- **Control Room Dashboard**: http://localhost:3000/dashboard
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## Step 9: Test the System

### 1. Register an NGO

Use API or create via MongoDB:

**API Request (POST):** `http://localhost:5000/api/ngos/register`

```json
{
  "organizationName": "Test NGO",
  "registrationNumber": "NGO001",
  "phone": "+1234567890",
  "email": "test@ngo.com",
  "location": {
    "longitude": -74.006,
    "latitude": 40.7128,
    "address": "New York, NY"
  },
  "services": ["safety", "medical"],
  "verified": true
}
```

### 2. Register a Volunteer

**API Request (POST):** `http://localhost:5000/api/volunteers/register`

```json
{
  "name": "Test Volunteer",
  "phone": "+1987654321",
  "email": "volunteer@test.com",
  "location": {
    "longitude": -74.007,
    "latitude": 40.713,
    "address": "New York, NY"
  },
  "skills": ["first-aid"],
  "verified": true,
  "availability": "available"
}
```

### 3. Create Emergency Request

1. Go to http://localhost:3000
2. Fill in the form with your details
3. Click "Get My Location" (allow browser location access)
4. Click "Send Emergency Request"
5. Check console for SMS simulation logs
6. Check dashboard to see the request

### 4. Login to Control Room

1. Go to http://localhost:3000/login
2. Email: `admin@controlroom.com`
3. Password: (the one you set)
4. View and manage requests

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: Authentication failed`

**Solutions:**

- Verify your MongoDB URI in `.env`
- Check MongoDB Atlas: Ensure IP whitelist includes your IP
- Check MongoDB Atlas: Verify database user credentials
- For local MongoDB: Ensure service is running

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**

- Change `PORT` in `.env` to another port (e.g., 5001)
- Find and stop the process using port 5000:

  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # Mac/Linux
  lsof -i :5000
  kill -9 <PID>
  ```

### Geolocation Not Working

**Error:** `User denied geolocation`

**Solutions:**

- Use HTTPS (geolocation requires secure context)
- In Chrome: Settings → Privacy → Site Settings → Location → Allow
- For development: Use `localhost` (always allowed)
- Manually enter coordinates in the code for testing

### SMS Not Sending

**Issue:** No SMS received

**Solutions:**

- Check Twilio credentials in `.env`
- Verify Twilio phone number format: E.164 (+1234567890)
- Check Twilio console for logs
- Verify recipient number is verified (required for trial accounts)
- Check console logs for "SMS simulation mode" message

### Frontend Not Loading

**Error:** `Cannot connect to backend`

**Solutions:**

- Verify backend is running on port 5000
- Check `proxy` in `client/package.json` points to correct backend URL
- Clear browser cache and restart

### JWT Token Invalid

**Error:** `Invalid token`

**Solutions:**

- Check `JWT_SECRET` is set in `.env`
- Clear localStorage in browser (F12 → Application → Local Storage)
- Login again to get new token

## Database Seeding (Optional)

For testing with sample data, you can create a seed script:

Create `server/seed.js`:

```javascript
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/database");
const NGO = require("./models/NGO");
const Volunteer = require("./models/Volunteer");

// Sample data here...

const seedDatabase = async () => {
  await connectDB();
  await NGO.deleteMany({});
  await Volunteer.deleteMany({});
  // Insert sample data
  process.exit();
};

seedDatabase();
```

Run: `node server/seed.js`

## Next Steps

- **Configure SMS**: Set up Twilio for production
- **Security**: Change JWT_SECRET and admin password
- **Deploy**: See deployment guide (coming soon)
- **Customize**: Adjust search radius, add more emergency types
- **Monitoring**: Set up logging and error tracking

## Need Help?

- Check `README.md` for overview
- Check `API_DOCUMENTATION.md` for API details
- Review `.github/copilot-instructions.md` for architecture details

---

**Important Security Notes:**

- Never commit `.env` file to version control
- Change default passwords before production
- Use HTTPS in production
- Implement rate limiting for production
- Regular security audits recommended
