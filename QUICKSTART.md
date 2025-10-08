# 🚀 Quick Start Guide - Expo Mobile App

Get the Emergency Response mobile app running in 5 minutes!

## ⚡ Super Quick Start

```bash
# 1. Install backend dependencies
npm install

# 2. Install mobile dependencies
cd mobile
npm install

# 3. Start backend (in root directory)
cd ..
npm run dev

# 4. Start mobile app (new terminal)
cd mobile
npm start
```

Then scan QR code with Expo Go app!

## 📋 Prerequisites Checklist

- [ ] Node.js installed (check: `node -v`)
- [ ] Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- [ ] Phone and computer on same WiFi
- [ ] MongoDB running (local or Atlas)

## 🎯 First-Time Setup

### 1. Environment Setup

Create `.env` file in root:

```env
MONGODB_URI=mongodb://localhost:27017/emergency-response
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 2. Configure Mobile API

Edit `mobile/services/api.js`:

Find your computer's IP:

- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

Update line 11 with YOUR IP:

```javascript
return "http://YOUR_IP_HERE:5000/api"; // e.g., 192.168.1.100
```

### 3. Create Admin Account

After starting backend, create admin:

**PowerShell:**

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/create-admin" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"admin@test.com","password":"Admin123!","name":"Admin","role":"super-admin"}'
```

**Or use Postman:**

- POST to `http://localhost:5000/api/auth/create-admin`
- Body:

```json
{
  "email": "admin@test.com",
  "password": "Admin123!",
  "name": "Admin User",
  "role": "super-admin"
}
```

## 📱 Testing the App

### Test Emergency Request Flow

1. Open app (shows Emergency Request screen)
2. Fill form:
   - Name: "Test User"
   - Phone: "+1234567890"
   - Type: Select any
   - Description: "Test emergency"
3. Tap "📍 Get My Location" → Allow permission
4. Tap "Send Emergency Request"
5. Check backend console for success message

### Test Control Room Dashboard

1. Add navigation to Login screen (or modify App.js)
2. Login with admin credentials
3. View dashboard with stats
4. See emergency requests
5. Update status

## 🔧 Common Setup Issues

### "Can't connect to server"

```bash
# Check backend is running
# Visit: http://localhost:5000/health

# Check your IP in mobile/services/api.js
# Make sure it matches: ipconfig (Windows) or ifconfig (Mac/Linux)

# For Android Emulator, use:
http://10.0.2.2:5000/api
```

### "Expo CLI not found"

```bash
npm install -g expo-cli
# Or use:
npx expo start
```

### "Module not found"

```bash
cd mobile
rm -rf node_modules
npm install
```

### Firewall Blocking

**Windows:**

```powershell
netsh advfirewall firewall add rule name="Expo" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="Expo Metro" dir=in action=allow protocol=TCP localport=8081
```

## 🎨 Adding Navigation Button

To access Login from Home screen, add to `EmergencyRequestScreen.js`:

```javascript
// At the top of the screen
<TouchableOpacity
  style={styles.loginLink}
  onPress={() => navigation.navigate("Login")}
>
  <Text style={styles.loginLinkText}>Control Room Login</Text>
</TouchableOpacity>
```

## 📚 Next Steps

1. **Test on physical device** - Best real-world testing
2. **Register NGOs/Volunteers** - Use API or create screens
3. **Customize theme** - Edit colors in screen styles
4. **Add features** - Maps, notifications, camera, etc.
5. **Deploy** - See MOBILE_SETUP.md for production build

## 🆘 Need Help?

- **Setup Issues**: Check MOBILE_SETUP.md
- **API Reference**: Check API_DOCUMENTATION.md
- **Architecture**: Check .github/copilot-instructions.md
- **Expo Docs**: https://docs.expo.dev/

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on port 5000
- [ ] MongoDB connected
- [ ] Mobile app opens in Expo Go
- [ ] Location permission works
- [ ] Can submit emergency request
- [ ] Can login to dashboard
- [ ] Requests appear in dashboard

## 🎉 Success!

If you can:

1. Submit emergency request from mobile
2. See it in console
3. Login to dashboard
4. View the request

**You're ready to go!** 🚨

---

## 📱 Scan & Go

1. Start backend: `npm run dev`
2. Start mobile: `cd mobile && npm start`
3. Scan QR code with Expo Go
4. Start saving lives!

**Remember**: Update API URL in `mobile/services/api.js` with your computer's IP address for physical device testing!
