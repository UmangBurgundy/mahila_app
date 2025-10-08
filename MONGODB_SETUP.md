# MongoDB Setup Guide

## ⚠️ MongoDB Not Running

Your backend server needs MongoDB to store data. You have two options:

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED ✅

**Free and easiest option - No installation needed!**

### Steps:

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** for a free account
3. **Create a free cluster**:
   - Select **M0 (Free tier)**
   - Choose a cloud provider (AWS/Google/Azure)
   - Select a region close to you
4. **Create Database User**:
   - Click "Database Access" → "Add New Database User"
   - Username: `mahila-app`
   - Password: `YourSecurePassword123` (save this!)
   - Select "Read and write to any database"
5. **Allow Network Access**:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP
6. **Get Connection String**:

   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://mahila-app:<password>@cluster0.xxxxx.mongodb.net/`

7. **Update .env file**:
   ```
   MONGODB_URI=mongodb+srv://mahila-app:YourSecurePassword123@cluster0.xxxxx.mongodb.net/emergency-response?retryWrites=true&w=majority
   ```
   (Replace `YourSecurePassword123` and the cluster URL with your actual values)

---

## Option 2: Local MongoDB - Requires Installation

### For Windows:

1. **Download MongoDB**:

   - Go to: https://www.mongodb.com/try/download/community
   - Download Windows MSI installer
   - Version: Latest (7.0+)

2. **Install MongoDB**:

   - Run the installer
   - Choose "Complete" installation
   - Install "MongoDB as a Service" (check the box)
   - Click "Install MongoDB Compass" (optional GUI tool)

3. **Start MongoDB Service**:

   ```powershell
   # Run as Administrator
   net start MongoDB
   ```

4. **Verify it's running**:

   ```powershell
   Get-Process mongod
   ```

5. **Your .env is already configured** for local MongoDB:
   ```
   MONGODB_URI=mongodb://localhost:27017/emergency-response
   ```

---

## After Setting Up MongoDB:

1. **Restart the backend server**:

   ```bash
   cd "c:\Users\Asus\mahila app"
   npm run dev
   ```

2. **Create test accounts**:

   ```bash
   node create-test-accounts.js
   ```

3. **Login credentials will be**:
   - **NGO**: ngo@test.com / password123
   - **Volunteer**: volunteer@test.com / password123

---

## Quick Test (After MongoDB is connected):

Run this in PowerShell:

```powershell
cd "c:\Users\Asus\mahila app"
node create-test-accounts.js
```

You should see:

```
✅ NGO account created successfully!
✅ Volunteer account created successfully!
```

Then you can login in the mobile app!

---

## Troubleshooting

### "ECONNREFUSED 27017"

- MongoDB is not running
- For local: Start MongoDB service
- For Atlas: Check connection string in .env

### "Authentication failed"

- Check MongoDB Atlas username/password in connection string
- Verify Network Access allows your IP

### "Port 5000 already in use"

- Kill the process: `Get-Process -Name node | Stop-Process -Force`
- Then restart: `npm run dev`
