# Mobile App Setup Guide (Expo)

Complete guide to setting up and running the Emergency Response mobile app with Expo.

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Backend Server** running (see main SETUP_GUIDE.md)
- For testing:
  - **iOS**: Mac with Xcode (for simulator) or iPhone with Expo Go
  - **Android**: Android Studio (for emulator) or Android phone with Expo Go

## Step 1: Install Expo CLI

```bash
npm install -g expo-cli
```

Verify installation:

```bash
expo --version
```

## Step 2: Install Dependencies

```bash
cd mobile
npm install
```

This installs all required packages:

- Expo SDK
- React Navigation
- Location services
- AsyncStorage
- Notifications
- And more...

## Step 3: Start Backend Server

The mobile app needs the backend API running. In the root directory:

```bash
npm run dev
```

Backend should be running on `http://localhost:5000`

## Step 4: Configure API Connection

### Find Your Computer's IP Address

**Windows:**

```powershell
ipconfig
```

Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**

```bash
ifconfig
```

Look for "inet" address (e.g., 192.168.1.100)

### Update API URL

Edit `mobile/services/api.js`:

```javascript
const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === "android") {
      return "http://10.0.2.2:5000/api"; // For Android Emulator
    }
    return "http://192.168.1.100:5000/api"; // Replace with YOUR IP
  }
  return "https://your-production-api.com/api";
};
```

**Important:**

- Use `10.0.2.2` for Android Emulator (it routes to host's localhost)
- Use `localhost` for iOS Simulator
- Use your computer's IP for physical devices

## Step 5: Start Expo Development Server

```bash
cd mobile
npm start
```

or

```bash
expo start
```

This will:

1. Start Metro bundler
2. Show QR code in terminal
3. Open Expo DevTools in browser

## Step 6: Run on Device/Simulator

### Option A: Physical Device (Easiest for Testing)

1. **Install Expo Go**:

   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan QR Code**:

   - iOS: Open Camera app and scan QR code
   - Android: Open Expo Go app and scan QR code

3. **Requirements**:
   - Phone and computer must be on **same WiFi network**
   - Allow location permissions when prompted

### Option B: iOS Simulator (Mac only)

```bash
npm run ios
```

or press `i` in the Expo terminal

**Requirements:**

- macOS with Xcode installed
- Xcode Command Line Tools: `xcode-select --install`

### Option C: Android Emulator

1. **Install Android Studio**:

   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK and create a virtual device (AVD)

2. **Start emulator** from Android Studio

3. **Run app**:
   ```bash
   npm run android
   ```
   or press `a` in the Expo terminal

## Step 7: Test the App

### 1. Test Emergency Request (User Flow)

1. App opens on Emergency Request screen
2. Fill in:
   - Your name
   - Phone number
   - Select emergency type
   - Describe the emergency
3. Tap "📍 Get My Location"
4. Allow location permission
5. Tap "Send Emergency Request"
6. Check backend console for SMS simulation

### 2. Test Control Room (Admin Flow)

1. Tap "Login" (add navigation button if needed)
2. Login with:
   - Email: `admin@controlroom.com`
   - Password: (your admin password)
3. View dashboard with statistics
4. See emergency requests
5. Update request status
6. Tap location to open in maps

## Troubleshooting

### Can't Connect to Backend

**Problem**: "Network Error" or "Cannot connect"

**Solutions**:

1. Verify backend is running: Visit `http://localhost:5000/health`
2. Check API URL in `services/api.js`
3. Ensure phone and computer on same WiFi
4. Check firewall: Allow port 5000
   ```powershell
   # Windows: Add firewall rule
   netsh advfirewall firewall add rule name="Expo" dir=in action=allow protocol=TCP localport=5000
   ```
5. For Android emulator, use `10.0.2.2` instead of `localhost`

### Location Permission Denied

**Problem**: Can't get location

**Solutions**:

1. Go to phone Settings → Apps → Expo Go → Permissions → Location → Allow
2. Enable GPS/Location Services on device
3. For iOS: Settings → Privacy → Location Services → On
4. For Android: Settings → Location → On

### Expo CLI Not Found

**Problem**: `expo: command not found`

**Solutions**:

```bash
# Install globally
npm install -g expo-cli

# Or use npx
npx expo start
```

### Metro Bundler Issues

**Problem**: Build errors or stuck loading

**Solutions**:

```bash
# Clear cache and restart
expo start -c

# Or
rm -rf node_modules
npm install
expo start -c
```

### Simulator Not Opening

**iOS:**

```bash
# Open Xcode, then
open -a Simulator
```

**Android:**

```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_5_API_30
```

### App Crashes on Launch

**Solutions**:

1. Check for errors in terminal
2. Verify all dependencies installed: `npm install`
3. Check Node version: `node -v` (should be 16+)
4. Clear Expo cache: `expo start -c`

## Development Tips

### Hot Reload

- Save files to see changes instantly
- Shake device to open developer menu
- Press `r` in terminal to reload
- Press `m` to toggle menu

### Debug with React Native Debugger

1. Press `Cmd+D` (iOS) or `Cmd+M` (Android)
2. Select "Debug Remote JS"
3. Opens Chrome debugger

### View Logs

```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android

# Or use Expo DevTools in browser
```

### Testing on Multiple Devices

You can test on multiple devices simultaneously:

1. Scan same QR code on different phones
2. Each device runs independently
3. Useful for testing user + admin flows

## Building for Production

### Development Build (for testing)

```bash
expo build:android
expo build:ios
```

### Production Build with EAS (Recommended)

1. **Install EAS CLI**:

   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:

   ```bash
   eas login
   ```

3. **Configure**:

   ```bash
   eas build:configure
   ```

4. **Build**:

   ```bash
   # Android
   eas build --platform android

   # iOS
   eas build --platform ios

   # Both
   eas build --platform all
   ```

5. **Submit to Stores**:
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

## Environment Variables

Create `.env` in mobile folder:

```env
API_URL=https://your-production-api.com/api
```

Use in code:

```javascript
import Constants from "expo-constants";
const API_URL = Constants.manifest.extra.apiUrl;
```

## Performance Optimization

### Enable Hermes (Android)

In `app.json`:

```json
{
  "expo": {
    "android": {
      "enableHermes": true
    }
  }
}
```

### Optimize Images

```bash
npm install -g sharp-cli
sharp input.png -o output.png
```

### Bundle Size

```bash
npx react-native-bundle-visualizer
```

## Security Checklist

- [ ] Change default API URL for production
- [ ] Implement certificate pinning for API calls
- [ ] Enable ProGuard for Android
- [ ] Use secure storage for tokens
- [ ] Implement rate limiting
- [ ] Add error reporting (Sentry)
- [ ] Test on both iOS and Android
- [ ] Validate all user inputs
- [ ] Implement proper logout

## Publishing

### Create App Store Listing

**iOS (App Store):**

1. Create Apple Developer account ($99/year)
2. Create App ID in Apple Developer Portal
3. Generate certificates and provisioning profiles
4. Submit for review (1-3 days)

**Android (Play Store):**

1. Create Google Play Developer account ($25 one-time)
2. Create app listing
3. Upload APK/AAB
4. Submit for review (few hours)

### Update Over-the-Air (OTA)

```bash
expo publish
```

Users get updates without app store:

- Works for JS code changes
- Doesn't work for native code changes

## Next Steps

- Add push notifications configuration
- Implement deep linking
- Add crash reporting (Sentry)
- Setup CI/CD pipeline
- Add analytics (Firebase)
- Implement offline mode
- Add unit tests

## Useful Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Clear cache
expo start -c

# Check for updates
expo upgrade

# View installed packages
npm list --depth=0

# Check bundle size
npx expo-cli export --dump-sourcemap
```

## Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/
- **Expo Forums**: https://forums.expo.dev/
- **GitHub Issues**: Report bugs in your repo

## Support

Having issues? Check:

1. This troubleshooting guide
2. Expo documentation
3. Stack Overflow
4. Expo Discord community

---

**Your emergency response app is ready to deploy!** 🚨📱
