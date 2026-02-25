# Desktop Setup Guide - Construction Field App

This guide explains how to run the Construction Field App on desktop platforms (Mac, Windows, Linux) using Expo Web and optional Electron support.

## Quick Start - Expo Web (Browser)

### Prerequisites
- Node.js 18+ and npm installed
- Git (to clone/pull the repo)

### Running on Web

```bash
# Install dependencies (if not already done)
npm install

# Start the web development server
npm run web

# The app will automatically open in your default browser at http://localhost:19006
```

The app is now running in development mode with hot reload enabled. Any changes you make to the code will automatically refresh in the browser.

### Building for Production (Web)

```bash
# Create an optimized production build
npx expo export --platform web

# This creates a 'dist' folder with static files ready to deploy
```

## Platform-Specific Features

### What Works on Web ✅
- Task management and viewing
- Form filling (with file upload fallback)
- User authentication
- Dashboard and analytics
- Offline data sync (browser storage)
- Photo gallery viewing
- Navigation and routing

### What Has Limitations on Web ⚠️
- **Camera**: No direct camera hardware access. On web, the "Take Photo" button becomes "Upload Photo"
- **File System**: Limited access. Photos are stored as base64 in browser storage
- **Location**: Browser asks permission; limited accuracy compared to native
- **Biometrics**: Not available on web. Uses PIN login instead

### What Works with Electron (Native Desktop) ✅
All native features including:
- Direct camera access
- Full file system access
- Location services
- Biometric authentication
- True offline support with full sync capabilities

## Advanced: Electron Desktop App

To build a native desktop application, follow these steps:

### 1. Install Electron Dependencies

```bash
npm install --save-dev electron electron-builder electron-main
npm install electron-squirrel-startup
```

### 2. Create electron-main.js

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:19006'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
```

### 3. Add to package.json

```json
{
  "homepage": "./",
  "main": "public/electron-main.js",
  "scripts": {
    "electron": "electron .",
    "electron-dev": "concurrently \"npm run web\" \"wait-on http://localhost:19006 && electron .\"",
    "electron-build": "npm run web && electron-builder"
  },
  "build": {
    "appId": "com.constructionfield.app",
    "files": [
      "dist/**/*",
      "public/electron-main.js",
      "node_modules/**/*"
    ],
    "directories": {
      "buildResources": "assets"
    }
  }
}
```

### 4. Run Electron Development

```bash
npm install --save-dev concurrently wait-on
npm run electron-dev
```

### 5. Build for Production

```bash
npm run electron-build
```

This creates:
- macOS: `.dmg` installer and `.app` bundle
- Windows: `.exe` installer
- Linux: `.AppImage` file

## Deployment Options

### Option 1: Deploy Expo Web to Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 2: Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Option 3: Self-Hosted Web Server

```bash
# Build static files
npx expo export --platform web

# Copy dist folder to your web server
scp -r dist/* user@your-server:/var/www/app/
```

### Option 4: Electron App Distribution

Built `.exe`, `.dmg`, or `.AppImage` files can be:
- Distributed via GitHub releases
- Hosted on your website
- Packaged in an app store

## Development Tips

### Hot Reload
Both web and Electron development modes support hot reload. Your changes will automatically reflect in the running app.

### Debugging Web
- Open browser DevTools (F12)
- Use React DevTools browser extension
- Check Console for errors and logs

### Debugging Electron
- Built-in DevTools accessible (Ctrl/Cmd + Shift + I)
- Chrome DevTools for debugging
- Console logs appear in both main and renderer processes

### Platform-Specific Code

```typescript
import { isWeb, isNative } from './utils/platformDetection';

if (isWeb) {
  // Web-only code
  handleWebFileUpload();
} else if (isNative) {
  // Native mobile code (iOS/Android)
  handleNativeCamera();
}
```

## Troubleshooting

### Port 19006 already in use

```bash
# Kill the process using the port
lsof -ti:19006 | xargs kill -9

# Or use a different port
npm run web -- --port 19007
```

### Build fails with "Cannot find module"

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Web app doesn't load
1. Check browser console for errors (F12)
2. Verify `public/index.html` exists
3. Check that `app.json` has `web` configuration
4. Try clearing browser cache (Ctrl/Cmd + Shift + Delete)

### Offline features not working in browser
- Check browser's localStorage quota (DevTools > Storage)
- Verify redux-persist is initialized
- Check IndexedDB for stored data

## Environment Variables

Create a `.env` file for environment-specific settings:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_ENVIRONMENT=development
```

These are accessible in your code via `process.env.REACT_APP_*`

## Performance Tips

1. **Web**: Enable gzip compression on your hosting
2. **Electron**: Code split and lazy load routes
3. **Both**: Profile with Chrome DevTools Performance tab
4. **Mobile Web**: Test on actual mobile devices for responsiveness

## Next Steps

- Run locally: `npm run web`
- Share with others: Deploy to Vercel or Firebase
- Package for desktop: Follow Electron setup above
- Optimize performance: Use profiling tools

For more info, see [Expo Web Documentation](https://docs.expo.dev/guides/web/)
