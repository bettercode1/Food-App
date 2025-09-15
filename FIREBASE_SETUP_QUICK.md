# Quick Firebase Setup Guide

## The Error You're Seeing
The `auth/invalid-api-key` error means your Firebase API key is either:
1. Not set in your `.env` file
2. Invalid/incorrect
3. The `.env` file is not being loaded properly

## Quick Fix Steps

### 1. Check Your .env File
Make sure your `.env` file exists in the project root and contains:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings (gear icon) > General
4. Scroll down to "Your apps" section
5. Click "Add app" > Web app (</> icon)
6. Register your app with a name
7. Copy the config object that appears

### 3. Update .env File
Replace the placeholder values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-12345
VITE_FIREBASE_STORAGE_BUCKET=your-project-12345.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Enable Authentication
1. In Firebase Console, go to Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

### 5. Enable Firestore
1. In Firebase Console, go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to you
5. Click "Done"

### 6. Restart Your Dev Server
```bash
npm run dev
```

## Test Your Setup
1. Open browser console
2. Look for Firebase initialization messages
3. Try logging in - it should work now

## Common Issues

**Still getting errors?**
- Make sure `.env` file is in the project root (same level as `package.json`)
- Restart your development server after updating `.env`
- Check that all environment variables start with `VITE_`
- Verify your Firebase project is active (not paused)

**Need help?**
- Check the browser console for specific error messages
- Verify your Firebase project settings
- Make sure you copied the config correctly (no extra spaces/characters)
