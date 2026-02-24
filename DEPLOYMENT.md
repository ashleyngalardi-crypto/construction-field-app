# Construction Field App - Deployment Runbook

**Version:** 1.0
**Last Updated:** February 2025

## Table of Contents

1. [Pre-Deployment Setup](#pre-deployment-setup)
2. [Firebase Configuration](#firebase-configuration)
3. [Sentry Setup](#sentry-setup)
4. [EAS Build Setup](#eas-build-setup)
5. [Building the App](#building-the-app)
6. [App Store Submission](#app-store-submission)
7. [Post-Launch Monitoring](#post-launch-monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Setup

### 1.1 Prerequisites

Before proceeding with deployment, ensure you have:

- **Apple Developer Account** ($99/year)
  - [Join Apple Developer Program](https://developer.apple.com/join/)
  - Create App Store Connect account

- **Google Play Developer Account** ($25 one-time)
  - [Create Google Play Account](https://play.google.com/console)

- **Expo Account** (free)
  - [Sign up at Expo.dev](https://expo.dev/signup)
  - Initialize EAS Project

- **Node.js** (v16+)
  - Verify: `node --version`

- **Xcode** (for iOS - macOS only)
  - Download from App Store
  - Verify: `xcode-select --print-path`

- **Android Studio** (for Android testing)
  - Download from android.com
  - Install Android SDK

### 1.2 Project Verification

Before starting the deployment process:

```bash
# Verify project structure
ls -la src/services/firebase.ts
ls -la app.json
ls -la package.json

# Verify dependencies
npm list expo @sentry/react-native firebase

# Run tests
npm run test:ci

# Check code quality
npm run lint
```

### 1.3 Environment Variables

#### Create .env.production

```bash
# Copy the template
cp .env.production.example .env.production

# Edit with your actual credentials
nano .env.production
```

**Required values to fill in:**
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_SENTRY_DSN`

**IMPORTANT:** Never commit `.env.production` to Git. It's already in `.gitignore`.

---

## Firebase Configuration

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Create a new project**
   - Project name: `construction-field-app-prod`
   - Analytics: Enable (optional)
3. Wait for project creation (2-3 minutes)

### 2.2 Configure Firebase Services

#### Enable Authentication
1. Go to **Authentication > Sign-in method**
2. Enable: **Phone**, **Email/Password**
3. Configure phone sign-in:
   - Set up reCAPTCHA (for web/test devices)
   - Add test phone numbers for testing

#### Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
   - Start in production mode
   - Select region: closest to your users
3. Create security rules (see below)

#### Create Storage Bucket
1. Go to **Storage**
2. Click **Create bucket**
   - Bucket name: `construction-field-app-prod.appspot.com`
   - Select region: same as Firestore
3. Configure permissions

#### Enable Cloud Functions (Optional)
1. Go to **Cloud Functions**
2. Deploy functions for server-side tasks
   - Example: Email notifications, data cleanup

### 2.3 Firestore Security Rules

Navigate to **Firestore Database > Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.uid in resource.data.companyAdmins;
    }

    // Companies collection - admins can manage, crew can read
    match /companies/{companyId} {
      allow read: if request.auth.uid in get(/databases/(default)/documents/companies/$(companyId)).data.crewIds ||
                     request.auth.uid in get(/databases/(default)/documents/companies/$(companyId)).data.adminIds;
      allow write: if request.auth.uid in get(/databases/(default)/documents/companies/$(companyId)).data.adminIds;
    }

    // Tasks collection
    match /tasks/{taskId} {
      allow read: if request.auth.uid in resource.data.visibleTo;
      allow create: if request.auth.uid in get(/databases/(default)/documents/companies/$(request.resource.data.companyId)).data.adminIds;
      allow update: if request.auth.uid == resource.data.assigneeId ||
                       request.auth.uid in get(/databases/(default)/documents/companies/$(resource.data.companyId)).data.adminIds;
    }

    // Forms collection
    match /forms/{formId} {
      allow read: if request.auth.uid != null;
      allow create: if request.auth.uid in get(/databases/(default)/documents/companies/$(request.resource.data.companyId)).data.adminIds;
      allow update: if request.auth.uid in get(/databases/(default)/documents/companies/$(resource.data.companyId)).data.adminIds;
    }

    // Photos collection
    match /photos/{photoId} {
      allow read: if request.auth.uid in get(/databases/(default)/documents/companies/$(resource.data.companyId)).data.crewIds ||
                     request.auth.uid in get(/databases/(default)/documents/companies/$(resource.data.companyId)).data.adminIds;
      allow create: if request.auth.uid in get(/databases/(default)/documents/companies/$(request.resource.data.companyId)).data.crewIds;
      allow delete: if request.auth.uid in get(/databases/(default)/documents/companies/$(resource.data.companyId)).data.adminIds;
    }

    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 2.4 Get Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Under "Your apps", select your iOS/Android app
3. Copy credentials:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

4. **Paste these into `.env.production`**

---

## Sentry Setup

### 3.1 Create Sentry Project

1. Go to [Sentry.io](https://sentry.io)
2. Sign up or log in
3. Click **Create Project**
   - Platform: **React Native**
   - Alert frequency: **As it happens**
4. Copy the **DSN** (starts with `https://`)

### 3.2 Add DSN to .env.production

```bash
EXPO_PUBLIC_SENTRY_DSN=https://YOUR_KEY@sentry.io/YOUR_PROJECT_ID
```

### 3.3 Configure Sentry

Sentry is already initialized in:
- `src/services/monitoring/sentry.ts`

Verify configuration:

```typescript
// Should use: process.env.EXPO_PUBLIC_SENTRY_DSN
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_ENV || 'production',
  tracesSampleRate: 1.0,
});
```

---

## EAS Build Setup

### 4.1 Install EAS CLI

```bash
npm install -g @expo/eas-cli
# OR
npx eas-cli@latest
```

### 4.2 Login to Expo/EAS

```bash
eas login
# You'll be prompted to open browser and log in
# Confirm access on your account
```

### 4.3 Configure EAS Project

```bash
eas build:configure
# This creates `eas.json` (already done)
# Links your project to your Expo account
```

Verify `eas.json` exists:

```bash
cat eas.json
```

### 4.4 Create Credentials

#### For iOS

```bash
eas credentials
# Select: iOS
# Select: Create or re-use existing Apple Certificates
# Follow prompts to create certificates
```

**What EAS will create:**
- Distribution Certificate (signing)
- Provisioning Profile (app distribution)
- Push Notification Certificate (optional)

#### For Android

```bash
eas credentials
# Select: Android
# Select: Create or re-use existing Google Play Credentials
# Follow prompts to create signing key
```

**What EAS will create:**
- Android Keystore (signing key)
- Google Play Service Account (submission)

---

## Building the App

### 5.1 Test Build (iOS Preview)

```bash
# Build test version for iOS
npm run build:ios:preview

# This will:
# 1. Compile your app
# 2. Create .ipa file
# 3. Upload to EAS
# 4. Provide test link via QR code
```

**On your device:**
- Scan QR code
- Open link in Safari
- Tap "Install"
- Trust the developer

### 5.2 Test Build (Android Preview)

```bash
# Build test version for Android
npm run build:android:preview

# This will:
# 1. Compile your app
# 2. Create .apk file
# 3. Provide download link
```

**On your device:**
- Download and install .apk
- Grant permissions
- Test all features

### 5.3 Test Checklist

Before production build, verify:

- [ ] All placeholder text replaced (Firebase, Sentry, URLs)
- [ ] Environment variables correctly set
- [ ] App icon displays correctly
- [ ] Splash screen appears
- [ ] Phone auth flow works
- [ ] Email auth flow works (admin)
- [ ] PIN setup works
- [ ] Biometric unlock works
- [ ] Tasks create and complete
- [ ] Forms submit with signatures
- [ ] Photos upload successfully
- [ ] Offline mode works (enable Airplane Mode)
- [ ] Sync works when online
- [ ] No console errors in Sentry
- [ ] App runs without crashing

### 5.4 Production Build (iOS)

```bash
# Update version number if needed
# Edit: app.json -> version: "1.0.0"
# Edit: eas.json -> build.production.ios.buildNumber: "1"

# Build production version
npm run build:ios:prod

# Outputs:
# - iOS Archive (.xcarchive)
# - Sent to Apple for processing
# - Ready for submission to App Store
```

**Build time:** ~20-30 minutes

### 5.5 Production Build (Android)

```bash
# Update version code
# Edit: eas.json -> build.production.android.versionCode: 1

# Build production version
npm run build:android:prod

# Outputs:
# - Android App Bundle (.aab)
# - Sent to Google for processing
# - Ready for submission to Play Store
```

**Build time:** ~15-20 minutes

---

## App Store Submission

### 6.1 iOS App Store Submission

#### Step 1: Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps > +** to create new app
3. Fill in:
   - **Name:** Construction Field
   - **Bundle ID:** com.yourcompany.constructionfield
   - **SKU:** construction-field-prod
   - **Platform:** iOS

#### Step 2: Fill in App Information

1. Go to **App Information**
2. Fill in:
   - **Subtitle:** Field management made simple
   - **Privacy Policy URL:** https://yourcompany.com/privacy
   - **Support URL:** https://yourcompany.com/support
   - **Privacy Practices:** Select appropriate categories

#### Step 3: Upload Screenshots

1. Go to **App Preview and Screenshots**
2. For each device size (6.7", 6.5", 5.5"):
   - Upload 3-5 screenshots
   - Add captions describing features
3. Upload iPad screenshots

**Screenshot Order:**
1. Login screen
2. Task dashboard
3. Task creation
4. Form filling
5. Admin workload

#### Step 4: Add App Description

1. Go to **Localization**
2. Select language: **English**
3. Fill in:
   - **Description:** (from PRIVACY.md)
   - **Keywords:** construction,field,task,inspection,safety,form,offline
   - **Support URL:** https://yourcompany.com/support

#### Step 5: Set Pricing

1. Go to **Pricing and Availability**
2. Select:
   - **Price Tier:** Free or paid
   - **Availability:** All countries
   - **Release Date:** Automatic (on approval)

#### Step 6: Add Build

1. Go to **Build**
2. Click **+** to add build
3. Select the production build you created
4. This will validate the binary

#### Step 7: Set Age Rating

1. Go to **Age Ratings**
2. Complete questionnaire:
   - Violence: None
   - Sexual Content: None
   - Alcohol/Tobacco: None
   - Final Rating: 4+

#### Step 8: App Review Information

1. Go to **App Review Information**
2. Fill in:
   - **Notes for Reviewers:** "This app helps construction teams manage tasks offline"
   - **Contact Information:** your-email@company.com
   - **Sign-In:** Required / Demo account credentials
   - **Test Account:** admin@test.com / testpass123

#### Step 9: Submit for Review

1. Review all information
2. Click **Submit for Review**
3. Apple reviews within 1-3 business days

### 6.2 Google Play Store Submission

#### Step 1: Create App in Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in:
   - **App name:** Construction Field
   - **Default language:** English
   - **App type:** Business

#### Step 2: Fill in Store Listing

1. Go to **Store Listing**
2. Fill in all fields:
   - **Short description:** (80 chars)
   - **Full description:** (4000 chars)
   - **Feature graphic:** 1024x500 PNG
   - **Screenshots:** 2-8 for phones, tablets
   - **App category:** Business

#### Step 3: Upload Screenshots

1. Go to **Screenshots**
2. Phone screenshots (1080x1920):
   - Upload 5-8 screenshots
   - Add brief descriptions
3. Tablet screenshots (optional)

#### Step 4: Add Release Notes

1. Go to **App releases**
2. Fill in Release notes: "Initial release of Construction Field"

#### Step 5: Upload Build

1. Go to **App releases > Internal testing > Create release**
2. Click **Browse files**
3. Upload the .aab file from EAS
4. Add release notes
5. Review and save

#### Step 6: Complete App Content Rating

1. Go to **App content rating**
2. Complete questionnaire:
   - Violence: None
   - Adult content: None
   - Other: None
   - Rating: 3+ or 4+

#### Step 7: Set Up Pricing

1. Go to **Pricing and distribution**
2. Select:
   - **Price:** Free or paid
   - **Countries/regions:** All
   - **Device categories:** Phones, Tablets
   - **Content rating:** 3+

#### Step 8: Complete Privacy Policy

1. Go to **Privacy policy**
2. Paste: https://yourcompany.com/privacy
3. Save

#### Step 9: Submit for Review

1. Go to **App releases > Internal testing**
2. Review all information
3. Click **Save > Review and roll out > Roll out to internal testing**
4. Google reviews within 2-3 hours (usually faster)

---

## Post-Launch Monitoring

### 7.1 First 24 Hours

After app goes live:

- [ ] Monitor Sentry dashboard for crashes
- [ ] Check Firebase Analytics for usage
- [ ] Review app store ratings and reviews
- [ ] Monitor user support emails
- [ ] Check Firebase database for data issues

### 7.2 First Week

- [ ] Respond to user reviews within 24 hours
- [ ] Monitor crash-free users (target: >99%)
- [ ] Review Firebase quotas and costs
- [ ] Check authentication flow for issues
- [ ] Monitor offline sync success rate

### 7.3 First Month

- [ ] Track key metrics:
  - Daily Active Users (DAU)
  - Monthly Active Users (MAU)
  - Crash-free users
  - Average session length
  - Task completion rate
  - Form submission rate
  - Offline sync success rate
- [ ] Implement feedback from users
- [ ] Plan for next release

### 7.4 Monitoring Dashboards

**Sentry:** https://sentry.io
- View crashes and errors
- Set up alerts for critical issues
- Review performance metrics

**Firebase Console:** https://console.firebase.google.com
- Analytics dashboard
- Database usage
- Authentication metrics
- Storage usage

**App Store Connect:**
- Sales and trends
- App analytics
- Crash reports
- Rating trends

**Google Play Console:**
- Install stats
- User retention
- Crash stats
- Rating trends

---

## Troubleshooting

### Issue: "Invalid credentials" during build

**Solution:**
```bash
# Re-authenticate with Expo
eas logout
eas login

# Recreate credentials
eas credentials --interactive
```

### Issue: App rejected for "Unresolved Privacy Question"

**Solution:**
- Update app.json with correct privacy URLs
- Ensure PRIVACY.md is accessible and complete
- Add "Privacy Practices" in App Store Connect

### Issue: Build fails with "Module not found"

**Solution:**
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install

# Clean build
npm run build:ios:prod --clean
```

### Issue: Firebase: "This APK or Android App Bundle is invalid"

**Solution:**
- Ensure app.json has correct package name
- Verify versionCode is incremented
- Check bundle signing is correct in eas.json

### Issue: App crashes on startup

**Solution:**
```bash
# Check Sentry for specific error
# Verify environment variables in .env.production
# Test locally: npm start
# Run tests: npm run test:ci

# Check Firebase rules
# Review console errors
```

### Issue: Offline sync not working

**Solution:**
- Verify network monitoring setup
- Check Firebase offline persistence is enabled
- Review Redux offline slice state
- Test with actual offline mode (Airplane Mode)

### Issue: Photos not uploading

**Solution:**
- Verify Firebase Storage permissions
- Check file size (limit to 5MB)
- Verify CORS rules in Storage
- Test with smaller image first

---

## Rollback Procedure

If critical issues are discovered after launch:

### 1. Immediate Actions

```bash
# Update app store listing with known issues
# Post announcement in support channel
# Begin hotfix development
```

### 2. Hotfix Development

```bash
# Create hotfix branch
git checkout -b hotfix/critical-issue

# Fix the issue
# Test thoroughly
npm run test:ci

# Commit
git commit -m "Fix critical issue"

# Build new version
# Increment version number
# Build and submit
npm run build:all:prod
```

### 3. Expedited Review

- Mark submission as urgent
- Mention critical security/functionality issue
- Apple/Google usually expedite within 4-6 hours

### 4. Communication

- Email users with workaround
- Update app store description
- Post on social media
- Provide ETA for fix

---

## Maintenance and Updates

### Monthly Updates

```bash
# Review Firebase metrics
# Check Sentry for recurring issues
# Update dependencies
npm update

# Test thoroughly
npm run test:ci

# Build and submit
npm run build:all:prod
```

### Quarterly Reviews

- Review Firebase costs and quotas
- Analyze user feedback
- Plan feature releases
- Update privacy policy if needed
- Ensure compliance with app store policies

---

## Support Contacts

**Apple Developer Support:**
- https://developer.apple.com/contact/app-review/
- Email: app-review@apple.com

**Google Play Support:**
- https://support.google.com/googleplay/android-developer/
- Email: support@google.com

**Expo Support:**
- https://forums.expo.dev
- Email: support@expo.dev

---

**Version:** 1.0
**Last Updated:** February 2025
**Next Review:** May 2025
