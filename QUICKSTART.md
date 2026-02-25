# Quick Start Guide - Construction Field App

Get the app running in seconds with these simple commands.

## 🚀 Run on Web (Browser)

### Development Mode (with hot reload)
```bash
npm run web
```
Opens automatically at `http://localhost:19006`

### Production Mode (optimized build)
```bash
npm run web:full
```
- Builds optimized app
- Serves at `http://localhost:3000`

## 📱 Run on Mobile

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Physical Device (via Expo Go)
```bash
npx expo start
# Scan QR code with Expo Go app
```

## 🎯 What Works Where

| Feature | Web | iOS | Android |
|---------|-----|-----|---------|
| Task Management | ✅ | ✅ | ✅ |
| Form Filling | ✅ | ✅ | ✅ |
| Photo Upload | ✅ (file) | ✅ (camera) | ✅ (camera) |
| Offline Sync | ✅ | ✅ | ✅ |
| Real-time Updates | ✅ | ✅ | ✅ |
| Camera Access | ⚠️ (file input) | ✅ | ✅ |
| Location | ⚠️ | ✅ | ✅ |

## 🔍 Development Tips

### Hot Reload
- **Web**: Auto-refresh on file save
- **Mobile**: Press `R` in terminal

### Debugging
- **Web**: Press F12 for DevTools
- **Mobile**: Press `D` in terminal for menu

### Clear Cache
```bash
npx expo start --clear
```

### Kill Port Conflicts
```bash
lsof -ti:19006 | xargs kill -9
```

## 📦 Building for Production

### Web (Static Files)
```bash
npm run web:build
# Creates dist/ folder for deployment
```

### iOS App
```bash
npm run build:ios:prod
```

### Android App
```bash
npm run build:android:prod
```

## 🌍 Deploying Web App

### Vercel (1 command)
```bash
vercel dist
```

### Firebase Hosting
```bash
firebase deploy
```

### Your Own Server
```bash
npm run web:build
# Upload dist/ folder to your web server
```

## 📝 Project Structure

```
src/
├── app/              # Navigation routes
├── screens/          # Screen components
├── components/       # Reusable UI components
├── services/         # API & Firebase
├── store/            # Redux state
├── theme/            # Design system
└── utils/            # Helpers
```

## 🆘 Common Issues

**Q: Port 19006 already in use?**
```bash
npm run web -- --port 19007
```

**Q: Modules not found?**
```bash
npm install
```

**Q: Build fails?**
```bash
rm -rf node_modules
npm install
npm run web
```

## 📚 More Info

- Full guide: See [DESKTOP_SETUP.md](./DESKTOP_SETUP.md)
- Project docs: See [README.md](./README.md)
- Expo docs: https://docs.expo.dev
- Platform detection: See `src/utils/platformDetection.ts`

## ✨ Features

✅ **Mobile & Web** - One codebase, multiple platforms
✅ **Offline First** - Works anywhere, syncs when online
✅ **Firebase** - Real-time data, cloud storage
✅ **Forms** - Dynamic inspection forms with validation
✅ **Photos** - Capture and upload with geolocation
✅ **Auth** - Phone, SMS, PIN authentication

## 🎓 Next Steps

1. **Run**: `npm run web` to see the app
2. **Explore**: Open `src/screens` to understand screens
3. **Customize**: Update `src/theme` for branding
4. **Deploy**: Follow deployment guide for web/mobile
5. **Build**: Create production builds for distribution

---

**Need help?** Check the full documentation or create an issue.

Happy coding! 🚀
