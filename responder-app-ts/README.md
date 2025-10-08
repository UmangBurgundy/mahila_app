# Emergency Response Mobile App (TypeScript)

## 🎯 Overview

This is the **Emergency Responder Mobile App** built with **Expo and TypeScript**. This app is for NGOs and Volunteers to view and respond to emergency requests in real-time.

## 📱 Features

### ✅ Implemented
- **Login Screen** - Authentication for NGOs and Volunteers
- **Emergency Requests List** - View all nearby emergency requests
- **Request Details** - Detailed view of each emergency
- **Accept/Reject Actions** - Respond to emergency requests
- **Map Integration** - Open location in Google Maps
- **Call Integration** - Direct call to person in distress
- **Pull to Refresh** - Update request list
- **Priority & Status Badges** - Visual indicators for urgency

### 🚧 To Be Implemented
- **API Integration** - Connect to backend server
- **Push Notifications** - Real-time alerts for new emergencies
- **GPS Tracking** - Track responder location
- **Authentication** - JWT token management
- **Profile Management** - Update responder details
- **Response History** - Track past responses

## 📂 Project Structure

```
responder-app-ts/
├── App.tsx                          # Main app with navigation
├── src/
│   └── screens/
│       ├── LoginScreen.tsx          # Login & user type selection
│       ├── RequestsScreen.tsx       # List of emergency requests
│       └── RequestDetailScreen.tsx  # Detailed emergency view
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Installation

1. **Install dependencies:**
   ```bash
   cd responder-app-ts
   npm install
   ```

2. **Install navigation packages:**
   ```bash
   npm install @react-navigation/native @react-navigation/stack
   npx expo install react-native-screens react-native-safe-area-context
   ```

3. **Install additional dependencies:**
   ```bash
   npm install axios @react-native-async-storage/async-storage
   ```

### Running the App

1. **Start Expo:**
   ```bash
   npm start
   ```

2. **Open on your device:**
   - Scan the QR code with Expo Go (Android)
   - Scan with Camera app (iOS - opens in Expo Go)

3. **Or run in simulator:**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (macOS only)
   - Press `w` for web browser

## 📱 Screens

### 1. Login Screen
- Select user type (NGO or Volunteer)
- Enter email and password
- Navigate to requests list

### 2. Requests Screen
- View all emergency requests
- Color-coded priority badges (Critical, High, Medium, Low)
- Status indicators (Pending, Acknowledged, In-Progress, Resolved)
- Pull-to-refresh to update list
- Tap on request to view details

### 3. Request Detail Screen
- Full emergency information
- Person details with call button
- Emergency type and priority
- Location with "Open in Maps" button
- Accept or Reject buttons for pending requests

## 🎨 Design Features

- **Color Scheme:**
  - Primary: Red (#e74c3c) - Emergency theme
  - Success: Green (#27ae60)
  - Info: Blue (#3498db)
  - Warning: Orange (#f39c12)

- **Components:**
  - Cards with elevation/shadow
  - Status badges
  - Priority indicators
  - Action buttons

## 🔌 API Integration (Next Step)

To connect to your backend server:

1. **Create API service file:**
   ```typescript
   // src/services/api.ts
   import axios from 'axios';
   
   const API_URL = 'http://10.157.192.202:5000/api';
   // or http://localhost:5000/api if using emulator
   
   export const api = axios.create({
     baseURL: API_URL,
   });
   ```

2. **Update screens to use real API:**
   - Replace mock data in RequestsScreen
   - Implement actual login in LoginScreen
   - Add accept/reject API calls in RequestDetailScreen

3. **Add authentication:**
   - Store JWT token with AsyncStorage
   - Add token to axios headers
   - Handle token expiration

## 📝 Current Status

✅ **UI Complete** - All screens designed and functional  
⚠️ **API Integration** - Using mock data, needs backend connection  
⚠️ **Authentication** - UI ready, needs JWT implementation  
⚠️ **Notifications** - Not yet implemented  

## 🛠️ Development Tips

### Hot Reload
- Shake device or press `m` in terminal to open developer menu
- Press `r` to reload
- Changes auto-refresh when you save files

### Debugging
- Press `j` in terminal to open debugger
- Use `console.log()` to see output in terminal
- React Native Debugger for advanced debugging

### Testing on Real Device
Your phone and computer must be on the same network. The backend is accessible at:
- **Backend API:** http://10.157.192.202:5000/api

## 🔧 Environment Configuration

Create a `.env` file:
```bash
API_URL=http://10.157.192.202:5000/api
```

## 📚 Next Steps

1. **Install remaining dependencies:**
   ```bash
   npx expo install react-native-screens react-native-safe-area-context
   npm install axios
   ```

2. **Test the app:**
   - Start the server (already running)
   - Start expo: `npm start`
   - Scan QR code with your phone

3. **Connect to Backend:**
   - Create API service
   - Replace mock data with real API calls
   - Test with backend server

4. **Add Push Notifications:**
   - Use Expo Notifications
   - Integrate with backend SMS service

5. **Deploy:**
   - Build with `eas build`
   - Publish to app stores

## 🎉 You're Ready!

Your emergency responder mobile app is set up with TypeScript! Just install the navigation packages and start developing:

```bash
cd responder-app-ts
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
npm start
```

**Scan the QR code and see your app running! 📱**
