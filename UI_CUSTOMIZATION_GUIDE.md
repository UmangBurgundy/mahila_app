# 🎨 UI Customization Guide

Learn how to customize the look and feel of your Emergency Response app!

## 📱 Mobile App UI (Expo/React Native)

### 🎯 Quick Start - Change Colors

All mobile screens are in: `mobile/screens/`

#### **Emergency Request Screen** (`EmergencyRequestScreen.js`)

**Change Button Colors:**

```javascript
// Find line ~250 in the styles section
button: {
  backgroundColor: '#FF6B6B',  // Change this! Try: '#4CAF50', '#2196F3', '#9C27B0'
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
},
```

**Change Background:**

```javascript
// Around line ~220
container: {
  flex: 1,
  backgroundColor: '#F5F5F5',  // Try: '#FFFFFF', '#E3F2FD', '#FFF3E0'
  padding: 20,
},
```

**Change Text Colors:**

```javascript
title: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#333',  // Change this!
  marginBottom: 20,
  textAlign: 'center',
},
```

---

#### **Dashboard Screen** (`DashboardScreen.js`)

**Change Status Badge Colors:**

```javascript
// Around line ~300
pendingBadge: {
  backgroundColor: '#FFA726',  // Orange - change to any color!
},
inProgressBadge: {
  backgroundColor: '#42A5F5',  // Blue
},
resolvedBadge: {
  backgroundColor: '#66BB6A',  // Green
},
```

**Change Card Styling:**

```javascript
// Around line ~250
card: {
  backgroundColor: '#FFFFFF',  // Card background
  borderRadius: 12,           // Corner roundness (0-20)
  padding: 15,
  marginBottom: 12,
  elevation: 3,               // Shadow depth (0-10)
  shadowColor: '#000',        // Shadow color
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,         // Shadow transparency (0-1)
  shadowRadius: 4,
},
```

**Change Stats Card Colors:**

```javascript
// Around line ~270
statsCard: {
  flex: 1,
  backgroundColor: '#E3F2FD',  // Change each card color!
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
},
```

---

#### **Login Screen** (`LoginScreen.js`)

**Change Input Fields:**

```javascript
// Around line ~150
input: {
  backgroundColor: '#F5F5F5',  // Input background
  padding: 15,
  borderRadius: 8,
  marginBottom: 15,
  fontSize: 16,
  borderWidth: 1,              // Border thickness
  borderColor: '#DDD',         // Border color
},
```

---

### 🖼️ Adding Images/Icons

**1. Add App Icon & Splash Screen:**

Place images in `mobile/assets/`:

- `icon.png` (1024x1024px)
- `splash.png` (1284x2778px)

**2. Add Images in Code:**

```javascript
// At the top of your screen file
import { Image } from 'react-native';

// In your component
<Image
  source={require('../assets/logo.png')}
  style={{ width: 100, height: 100 }}
/>

// Or from URL
<Image
  source={{ uri: 'https://example.com/image.png' }}
  style={{ width: 100, height: 100 }}
/>
```

---

### 🔤 Changing Text/Labels

**Emergency Types** (`EmergencyRequestScreen.js`):

```javascript
// Around line ~70
const emergencyTypes = [
  { label: "🚨 Medical Emergency", value: "medical" },
  { label: "🔥 Fire", value: "fire" },
  { label: "👮 Police", value: "police" },
  { label: "🏠 Domestic Violence", value: "domestic_violence" },
  { label: "⚠️ Other", value: "other" },
];

// Change these labels to whatever you want!
// Add emoji, change wording, add more types
```

**Screen Titles:**

```javascript
// Change the title text
<Text style={styles.title}>Emergency Help Request</Text>
// To:
<Text style={styles.title}>Need Help? We're Here!</Text>
```

---

### 📐 Layout Changes

**Change Button Size:**

```javascript
button: {
  padding: 20,        // Increase for bigger button
  borderRadius: 15,   // More rounded corners
  minHeight: 60,      // Minimum height
},
```

**Change Spacing:**

```javascript
container: {
  padding: 30,        // More space around edges
},

// Add space between elements
marginBottom: 20,     // Space below element
marginTop: 10,        // Space above element
```

**Change Font Size:**

```javascript
title: {
  fontSize: 28,       // Bigger title (default: 24)
},
label: {
  fontSize: 18,       // Bigger labels (default: 16)
},
```

---

## 🌐 Web App UI (React)

Web files are in: `client/src/components/`

### **Emergency Form** (`EmergencyRequestForm.js` + `.css`)

**Change Colors in CSS file:**

```css
/* In EmergencyRequestForm.css */

.emergency-form {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change gradient colors! Try: #f093fb 0%, #f5576c 100% */
}

.emergency-form button {
  background: #ff6b6b; /* Change button color */
}

.emergency-form button:hover {
  background: #ff5252; /* Hover color */
}
```

**Change Layout:**

```css
.form-group {
  margin-bottom: 20px; /* Space between fields */
}

input,
select,
textarea {
  padding: 15px; /* Input field size */
  border-radius: 8px; /* Rounded corners */
  font-size: 16px; /* Text size */
}
```

---

### **Dashboard** (`Dashboard.js` + `.css`)

**Change Status Colors:**

```css
/* In Dashboard.css */

.status-pending {
  background-color: #ffa726; /* Orange */
  color: white;
}

.status-in-progress {
  background-color: #42a5f5; /* Blue */
}

.status-resolved {
  background-color: #66bb6a; /* Green */
}
```

**Change Card Style:**

```css
.request-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Shadow */
  margin-bottom: 20px;
}

.request-card:hover {
  transform: translateY(-2px); /* Lift on hover */
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}
```

---

## 🎨 Color Palette Suggestions

### **Modern & Professional**

```javascript
primary: '#2196F3',      // Blue
secondary: '#FF5722',    // Deep Orange
success: '#4CAF50',      // Green
warning: '#FFC107',      // Amber
danger: '#F44336',       // Red
background: '#F5F5F5',   // Light Gray
text: '#212121',         // Dark Gray
```

### **Vibrant & Bold**

```javascript
primary: '#9C27B0',      // Purple
secondary: '#FF4081',    // Pink
success: '#00BCD4',      // Cyan
warning: '#FFEB3B',      // Yellow
danger: '#FF5722',       // Deep Orange
background: '#FFFFFF',   // White
text: '#000000',         // Black
```

### **Calm & Soothing**

```javascript
primary: '#00897B',      // Teal
secondary: '#26A69A',    // Light Teal
success: '#66BB6A',      // Green
warning: '#FFA726',      // Orange
danger: '#EF5350',       // Red
background: '#E0F2F1',   // Very Light Teal
text: '#004D40',         // Dark Teal
```

---

## 🔧 Common Customizations

### 1. **Add a Logo**

```javascript
// In EmergencyRequestScreen.js (top of screen)
<View style={styles.header}>
  <Image
    source={require('../assets/logo.png')}
    style={styles.logo}
  />
  <Text style={styles.title}>Emergency Response</Text>
</View>

// In styles section
logo: {
  width: 80,
  height: 80,
  marginBottom: 10,
  alignSelf: 'center',
},
```

### 2. **Add Custom Fonts**

```bash
# Install custom fonts in mobile app
npx expo install expo-font @expo-google-fonts/roboto
```

```javascript
// In App.js
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

// In component
let [fontsLoaded] = useFonts({
  Roboto_400Regular,
  Roboto_700Bold,
});

// In styles
text: {
  fontFamily: 'Roboto_400Regular',
},
```

### 3. **Add Animations**

```javascript
import { Animated } from "react-native";

// Create animation value
const fadeAnim = new Animated.Value(0);

// Animate on mount
useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();
}, []);

// Use in component
<Animated.View style={{ opacity: fadeAnim }}>
  <Text>This will fade in!</Text>
</Animated.View>;
```

### 4. **Add Icons**

```bash
# Icons are already available with Expo
```

```javascript
import { Ionicons } from '@expo/vector-icons';

// Use in component
<Ionicons name="alert-circle" size={24} color="red" />
<Ionicons name="checkmark-circle" size={24} color="green" />
<Ionicons name="location" size={24} color="blue" />
```

---

## 📱 Live Preview Changes

### **Mobile App (Expo)**

Changes appear automatically when you save! Just shake your phone and select "Reload"

Or press **`r`** in the terminal to reload

### **Web App (React)**

Changes appear automatically in browser when you save

---

## 🎯 Quick Change Checklist

- [ ] Change primary button color
- [ ] Change background colors
- [ ] Update text colors for readability
- [ ] Adjust spacing/padding
- [ ] Change status badge colors
- [ ] Update emergency type labels
- [ ] Add your app logo
- [ ] Customize card styles
- [ ] Test on dark/light themes

---

## 💡 Tips

1. **Use consistent colors** - Pick 3-5 colors and stick to them
2. **Test contrast** - Make sure text is readable on backgrounds
3. **Keep it simple** - Don't use too many different styles
4. **Test on phone** - Colors look different on actual devices
5. **Save often** - Changes appear instantly, so experiment!

---

## 🆘 Need Help?

**File Locations:**

- Mobile Screens: `mobile/screens/*.js`
- Web Components: `client/src/components/*.js`
- Web Styles: `client/src/components/*.css`

**Find Styles:**

- Search for `styles = StyleSheet.create` in mobile files
- Search for `className=` in web files to find CSS classes

**Test Changes:**

- Mobile: Press `r` to reload
- Web: Save file, browser auto-refreshes

---

## 🎨 Example: Complete Color Scheme Change

Let's change to a "Purple Theme":

```javascript
// In EmergencyRequestScreen.js styles:
container: {
  backgroundColor: '#F3E5F5',  // Light purple background
},
button: {
  backgroundColor: '#9C27B0',  // Purple button
},
locationButton: {
  backgroundColor: '#7B1FA2',  // Dark purple
},

// In DashboardScreen.js styles:
pendingBadge: {
  backgroundColor: '#BA68C8',  // Light purple
},
statsCard: {
  backgroundColor: '#E1BEE7',  // Very light purple
},
```

Save and reload - instant purple theme! 🎨

---

**Happy Customizing! 🚀**
