# Firebase Setup Guide - Production

**Estimated Time:** 20-30 minutes
**Difficulty:** Easy
**Status:** Step-by-step instructions below

---

## Overview

This guide walks you through setting up a production Firebase project for Construction Field app. By the end, you'll have:
- ✅ Firebase project created
- ✅ Authentication enabled (Phone, Email)
- ✅ Firestore database created
- ✅ Storage bucket created
- ✅ Credentials extracted
- ✅ `.env.production` populated
- ✅ App tested with real Firebase

---

## Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Open https://console.firebase.google.com
2. Sign in with your Google account (create one if needed)

### 1.2 Create New Project
1. Click **Create a project** or **+ Add project**
2. **Project name:** `construction-field-app-prod`
3. Click **Continue**

### 1.3 Configure Google Analytics (Optional)
- **Enable Google Analytics:** Yes (optional, helpful for analytics)
- **Analytics location:** Select your country
- Click **Create project**

### 1.4 Wait for Project Creation
- Firebase will create your project (usually 2-3 minutes)
- You'll see: "Your new cloud project is ready"
- Click **Continue** to proceed

---

## Step 2: Enable Authentication

### 2.1 Navigate to Authentication
1. In the left sidebar, click **Authentication**
2. Click **Get started** (or **Sign-in method** tab)

### 2.2 Enable Phone Authentication
1. Under "Sign-in providers", click **Phone**
2. Toggle **Enable** to ON
3. Configure (if needed):
   - reCAPTCHA: Keep default
   - Phone numbers: Can add test numbers later
4. Click **Save**

### 2.3 Enable Email/Password Authentication
1. Click **Email/Password**
2. Toggle **Enable** to ON
3. For "Email enumeration protection": Keep "Do not enable" (default)
4. Click **Save**

### 2.4 Verify Both Are Enabled
- ✅ Phone (should show green checkmark)
- ✅ Email/Password (should show green checkmark)

---

## Step 3: Create Firestore Database

### 3.1 Navigate to Firestore
1. In the left sidebar, click **Firestore Database** (under "Build")
2. Click **Create database**

### 3.2 Configure Database
1. **Start in production mode** (selected by default)
   - This requires security rules (we'll add them)
2. **Location:** Select closest to your users
   - Example: `us-central1` for US, `europe-west1` for EU
3. Click **Create**

### 3.3 Create Security Rules
Firebase will ask for security rules. Paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default: deny all access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Click **Publish** to apply these rules.

**Note:** We'll expand these rules later for specific collections.

### 3.4 Verify Database Creation
- You should see a message: "Firestore Database created"
- The database should show "Location: [your selected region]"

---

## Step 4: Create Storage Bucket

### 4.1 Navigate to Storage
1. In the left sidebar, click **Storage** (under "Build")
2. Click **Get started** or **Create bucket**

### 4.2 Configure Bucket
1. **Bucket name:** Will auto-populate as `construction-field-app-prod.appspot.com`
   - DO NOT change this
2. **Location:** Select same as Firestore database (important!)
3. Click **Create**

### 4.3 Storage Rules
Firebase will ask for storage rules. Use this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

Click **Publish**

### 4.4 Verify Bucket Creation
- You should see: "Bucket created at gs://construction-field-app-prod.appspot.com"

---

## Step 5: Get Firebase Credentials

### 5.1 Go to Project Settings
1. Click the **⚙️ Settings icon** (top left, next to project name)
2. Select **Project settings**

### 5.2 Find Your App Configuration
1. Scroll down to **"Your apps"** section
2. Click **iOS** app icon (or create if not showing)
3. Look for the configuration section

### 5.3 Copy Credentials
You need these values:

```
API Key: [Copy this]
Auth Domain: [Your Project ID].firebaseapp.com
Project ID: [Copy this]
Storage Bucket: [Your Project ID].appspot.com
Messaging Sender ID: [Copy this]
App ID: [Copy this]
```

**Find each value:**

1. **Project ID:**
   - In Settings > General tab
   - Look for "Project ID" field
   - Example: `construction-field-app-prod`

2. **API Key:**
   - In Settings > Service Accounts tab
   - Click "Generate new private key"
   - Or find existing key in "API keys" section
   - Copy the key value

3. **Auth Domain:**
   - `[PROJECT_ID].firebaseapp.com`
   - Example: `construction-field-app-prod.firebaseapp.com`

4. **Messaging Sender ID:**
   - In Settings > Cloud Messaging tab
   - Look for "Sender ID" field

5. **Storage Bucket:**
   - `[PROJECT_ID].appspot.com`
   - Example: `construction-field-app-prod.appspot.com`

6. **App ID:**
   - In Settings > General tab
   - Look for "App ID" or in your app configuration

---

## Step 6: Update Environment Variables

### 6.1 Create `.env.production`

```bash
cd /Users/ashleygalardi/construction-field-app
cp .env.production.example .env.production
```

### 6.2 Edit `.env.production`

Open the file and fill in with your Firebase credentials:

```bash
nano .env.production
```

**Template to fill:**

```
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_HERE
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=construction-field-app-prod.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=construction-field-app-prod
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=construction-field-app-prod.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID_HERE
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID_HERE

EXPO_PUBLIC_SENTRY_DSN=https://YOUR_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID

EXPO_PUBLIC_ENV=production
```

**Example (filled):**

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC_abc123_xyz789_your_real_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=construction-field-app-prod.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=construction-field-app-prod
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=construction-field-app-prod.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789

EXPO_PUBLIC_SENTRY_DSN=https://placeholder_for_now@sentry.io/placeholder

EXPO_PUBLIC_ENV=production
```

### 6.3 Save File

- Press `Ctrl+O` to save
- Press `Enter` to confirm
- Press `Ctrl+X` to exit nano

### 6.4 Verify File

```bash
cat .env.production
```

Should show your credentials (non-sensitive parts visible).

---

## Step 7: Test Firebase Connection

### 7.1 Start Development Server

```bash
cd /Users/ashleygalardi/construction-field-app
npm start
```

### 7.2 Watch for Firebase Initialization

Look for these logs (good signs):
```
Firebase initialized successfully
Connected to Firestore
Storage initialized
```

If you see errors like:
```
Missing Firebase environment variables: EXPO_PUBLIC_FIREBASE_API_KEY
```

Check that `.env.production` has all required values.

### 7.3 Test Authentication Flow

1. Press `i` to open iOS simulator (or `a` for Android)
2. Try phone authentication:
   - Enter test phone number: `+1 555-555-0123`
   - Should work if configured correctly

### 7.4 Check Firebase Console

1. Go back to https://console.firebase.google.com
2. Go to **Authentication > Users**
3. If phone number appears there, it worked! ✅

---

## Step 8: Configure Security Rules (Optional but Recommended)

### 8.1 Update Firestore Rules

For now, we have basic rules that deny everything. To enable the app to function, update them:

**Go to Firestore > Rules and paste:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // Companies collection
    match /companies/{companyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Tasks collection
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Allow all for now (develop mode)
    // TODO: Tighten these before production
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click **Publish**

### 8.2 Update Storage Rules

**Go to Storage > Rules and paste:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read/write
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click **Publish**

---

## Troubleshooting

### Issue: "Missing Firebase environment variables"

**Solution:**
1. Verify `.env.production` exists in project root
2. Check all 6 environment variables are set
3. No typos in variable names
4. Restart dev server: `npm start`

### Issue: "Firebase initialization failed"

**Solution:**
1. Verify all credentials are correct (copy-paste from console)
2. Check Firebase project is actually created
3. Try: `npm start --reset-cache`
4. Check internet connection

### Issue: "Authentication not working"

**Solution:**
1. Verify "Phone" is enabled in Firebase Authentication
2. Check Firestore rules allow `request.auth != null`
3. Try adding test phone number in Firebase console
4. Check device time is correct

### Issue: "Cannot write to Firestore"

**Solution:**
1. Go to Firestore > Rules
2. Verify rules allow write operations
3. Temporarily use development rules (allow all)
4. Check Storage bucket region matches Firestore region

---

## Verification Checklist

After completing all steps:

- [ ] Firebase project created: `construction-field-app-prod`
- [ ] Authentication enabled: Phone + Email/Password
- [ ] Firestore database created and active
- [ ] Storage bucket created and active
- [ ] `.env.production` created with all 6 Firebase credentials
- [ ] `.env.production` does NOT contain placeholder values
- [ ] App starts without Firebase environment variable warnings
- [ ] Phone authentication works in app
- [ ] New phone numbers appear in Firebase > Authentication > Users

---

## What's Next?

Once Firebase is working:

1. **[OPTIONAL] Set up Sentry** for crash reporting
   - See: FIREBASE_SETUP.md (next section, if added)

2. **Create Test Builds**
   ```bash
   npm run build:ios:preview
   npm run build:android:preview
   ```

3. **Test on Real Devices**
   - Install via TestFlight (iOS)
   - Install via Play Store beta (Android)

4. **Create Screenshots**
   - Capture 5-8 screenshots
   - Show auth, tasks, forms, offline mode

5. **Submit to App Stores**
   - See: DEPLOYMENT.md for detailed instructions

---

## Firebase Console Quick Links

- **Main Dashboard:** https://console.firebase.google.com
- **Your Project:** https://console.firebase.google.com/project/construction-field-app-prod
- **Authentication Users:** https://console.firebase.google.com/project/construction-field-app-prod/authentication/users
- **Firestore Database:** https://console.firebase.google.com/project/construction-field-app-prod/firestore
- **Storage:** https://console.firebase.google.com/project/construction-field-app-prod/storage

---

## Important Notes

**Security:**
- ✅ Never commit `.env.production` (it's in `.gitignore`)
- ✅ Never share your API key publicly
- ✅ Keep credentials secure

**Firebase Quotas:**
- Free tier (Spark):
  - 50k reads/day
  - 20k writes/day
  - 20k deletes/day
  - 1GB storage
- Sufficient for testing and small-scale deployments
- Automatic upgrade to Blaze (pay-as-you-go) if needed

**Costs:**
- Spark (Free): $0/month (with limits)
- Blaze (Pay-as-you-go): ~$1-50/month depending on usage
- Small app: ~$5-20/month

---

**Time to Complete:** ~20-30 minutes
**Status:** Ready for next steps once complete ✅

For questions, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Setup Guide](https://firebase.google.com/docs/projects/learn-more)
