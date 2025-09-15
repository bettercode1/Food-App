# Environment Setup Guide

This guide explains how to set up the environment variables for Firebase and Google Maps API integration.

## Required Environment Variables

### Firebase Configuration
You need to create a Firebase project and get the following credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > General > Your apps
4. Add a web app and copy the configuration

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Google Maps API Configuration
You need to enable Google Maps JavaScript API:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the API key to your domain

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update .env with your actual credentials:**
   - Replace all placeholder values with your actual API keys
   - Make sure to keep the `VITE_` prefix for client-side variables

3. **Firebase Setup:**
   - Enable Authentication in Firebase Console
   - Enable Firestore Database
   - Set up security rules for your collections

4. **Google Maps Setup:**
   - Enable Maps JavaScript API
   - Enable Places API (optional, for enhanced features)
   - Set up API key restrictions for security

## Security Notes

- Never commit your `.env` file to version control
- Use different API keys for development and production
- Set up proper API key restrictions in Google Cloud Console
- Configure Firebase security rules appropriately

## Features Enabled

With this setup, you get:

### Firebase Features:
- ✅ User authentication (login/register)
- ✅ Real-time database (Firestore)
- ✅ File storage
- ✅ Analytics (optional)

### Google Maps Features:
- ✅ Interactive maps
- ✅ Restaurant location markers
- ✅ Info windows with restaurant details
- ✅ Automatic map bounds fitting
- ✅ Custom marker icons

## Troubleshooting

### Common Issues:

1. **Firebase not connecting:**
   - Check if all Firebase environment variables are set
   - Verify Firebase project is active
   - Check browser console for errors

2. **Google Maps not loading:**
   - Verify Google Maps API key is correct
   - Check if Maps JavaScript API is enabled
   - Ensure API key has proper restrictions

3. **Authentication errors:**
   - Check Firebase Authentication is enabled
   - Verify email/password sign-in is enabled
   - Check Firestore security rules

## Development vs Production

- **Development:** Use Firebase emulators (optional)
- **Production:** Use live Firebase services
- **API Keys:** Use different keys for different environments
- **Security:** Implement proper restrictions and rules
