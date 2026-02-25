# Construction Field App

A mobile-first field crew management application built with React Native, Expo, and Firebase. Features real-time task management, inspection forms, photo uploads, and full offline support.

## Features

✅ **Mobile & Web Platforms** - Works on iOS, Android, and web browsers
✅ **Task Management** - Assign and track construction tasks
✅ **Inspection Forms** - Dynamic forms with validation
✅ **Photo Capture** - Capture and upload photos with geolocation
✅ **Offline First** - Full offline support with automatic sync
✅ **Real-time Updates** - Firebase Firestore integration
✅ **Crew Management** - Assign crew members and track performance
✅ **Dashboard** - Analytics and project overview
✅ **Authentication** - Phone/SMS verification + PIN login

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd construction-field-app

# Install dependencies
npm install
```

## Running the App

### Mobile (iOS/Android)
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Expo Go (physical device)
npx expo start
# Scan QR code with Expo Go app
```

### Web Browser
```bash
# Development mode with hot reload
npm run web

# Production build
npm run web:build

# Serve production build locally
npm run web:serve

# Build and serve in one command
npm run web:full
```

The web app will be available at `http://localhost:3000` (or `http://localhost:19006` for dev mode).

### Desktop (Electron - Optional)

For native desktop application support, see [DESKTOP_SETUP.md](./DESKTOP_SETUP.md).

## Project Structure

```
construction-field-app/
├── src/
│   ├── app/                 # Expo Router navigation
│   ├── screens/             # Screen components
│   ├── components/          # Reusable components
│   ├── services/            # API and Firebase services
│   ├── store/               # Redux state management
│   ├── theme/               # Design system
│   ├── utils/               # Utilities and helpers
│   └── App.tsx              # Root component
├── assets/                  # Images, fonts, icons
├── public/                  # Web-specific assets
├── dist/                    # Built web app (generated)
├── app.json                 # Expo configuration
├── DESKTOP_SETUP.md         # Desktop deployment guide
└── README.md                # This file
```

## Platform-Specific Features

### Mobile (iOS & Android) ✅
- Camera access for photo capture
- Photo gallery selection
- Location services
- Biometric authentication
- Full file system access

### Web Browser ⚠️
- Photo upload via file input
- Limited location access
- PIN authentication only
- Browser storage for offline data

## Development

### Available Scripts

```bash
npm run start          # Start dev server (prompts for platform)
npm run ios           # iOS development
npm run android       # Android development
npm run web           # Web development
npm run lint          # Run ESLint
npm test              # Run tests in watch mode
npm run test:ci       # Run tests for CI/CD
npm run web:build     # Build web app for production
npm run web:serve     # Serve production web build
npm run web:full      # Build and serve web app
```

### Hot Reload
All development modes support hot reload. Save files to see changes instantly.

### Debugging

- **Web**: Press F12 to open DevTools. Use React DevTools extension for component inspection.
- **Mobile**: Use `exp://localhost:19000` for debugging with Expo DevTools.
- **Electron**: Built-in DevTools (Ctrl/Cmd + Shift + I).

## Deployment

### Web (Browser)

**Deploy to Vercel (Free & Easy):**
```bash
npm install -g vercel
npm run web:build
vercel dist
```

**Deploy to Firebase Hosting:**
```bash
firebase init hosting
npm run web:build
firebase deploy
```

**Self-Hosted Server:**
```bash
npm run web:build
# Copy dist/ folder to your web server
```

### Mobile (iOS/Android)

```bash
# Build iOS
npm run build:ios:prod

# Build Android
npm run build:android:prod

# Submit to app stores
npm run submit:ios
npm run submit:android
```

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```
EXPO_PUBLIC_FIREBASE_API_KEY=xxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
EXPO_PUBLIC_FIREBASE_PROJECT_ID=xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
EXPO_PUBLIC_FIREBASE_APP_ID=xxx
```

These are already configured in `app.json` for development.

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Cloud Storage
4. Enable Authentication (Phone & Email)
5. Copy credentials to environment variables above
6. Update security rules in Firebase Console

## Troubleshooting

### Port Already in Use
```bash
# Kill the process using the port
lsof -ti:8081 | xargs kill -9
```

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Cache Issues
```bash
npx expo start --clear
```

### Build Errors
```bash
# Clear build cache
npm run reset-project
npm install
```

## API Documentation

The app communicates with Firebase through the service layer:

- **Tasks**: `src/services/api/taskService.ts`
- **Forms**: `src/services/api/formService.ts`
- **Crew**: `src/services/api/crewService.ts`
- **Photos**: `src/services/api/photoService.ts`

All services support offline queueing through the `offlineUtils.ts` sync system.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test FormFillingScreen

# Update snapshots
npm run test:update

# Debug tests
npm run test:debug
```

## Performance Optimization

- **Web**: Bundles are tree-shaken and minified (2.8MB total)
- **Mobile**: Uses Hermes engine for faster startup
- **Lazy Loading**: Routes and components are code-split
- **Image Optimization**: Photos are compressed before upload
- **Caching**: Firebase persistence + browser storage

## Security

- Credentials stored securely in Keychain/Keystore
- All API calls are HTTPS only
- Firebase security rules enforce authentication
- User data is encrypted in transit and at rest
- Regular security audits via Expo SDK updates

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Contact the development team

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [Redux Documentation](https://redux.js.org/)

---

**Version**: 1.0.0
**Last Updated**: February 2026
**Status**: Active Development
