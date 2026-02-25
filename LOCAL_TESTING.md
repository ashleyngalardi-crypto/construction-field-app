# Local Testing Guide - Getting the Web App Running

Follow these exact steps to run the app locally on your machine.

## 🚀 Quick Start (Choose One Method)

### Method 1: Development Mode (Hot Reload) - RECOMMENDED
Best for development with automatic code reloading.

**Terminal:**
```bash
cd /Users/ashleygalardi/construction-field-app
npm run web
```

**What happens:**
1. Metro bundler starts
2. Webpack compiles for web
3. Prints a URL in the terminal
4. Browser might open automatically
5. Look for a URL like: `http://localhost:19006` or `exp://localhost:19006`

**Note:** Port may vary (19006, 8081, 8082, etc.) - check terminal output for the actual URL

---

### Method 2: Production Mode (Optimized) - Fastest Performance

Build an optimized version and serve it locally.

**Terminal:**
```bash
cd /Users/ashleygalardi/construction-field-app
npm run web:full
```

**What happens:**
1. Builds optimized production bundle
2. Starts local HTTP server
3. Opens at: `http://localhost:3000`
4. Shows loading spinner if app takes time

**Note:** This is the fast way to test the actual production bundle

---

### Method 3: Just Serve (Already Built)

If you already built, just serve the dist folder.

**Terminal:**
```bash
cd /Users/ashleygalardi/construction-field-app
npm run web:serve
```

**Access at:** `http://localhost:3000`

---

## 🔍 Troubleshooting

### Issue: "Port already in use"

**Solution:**
```bash
# Find what's using the port
lsof -i :3000
lsof -i :19006

# Kill it
kill -9 <PID>

# Then try again
npm run web
```

### Issue: "Command not found: npm"

**Solution:**
```bash
# Install Node.js from nodejs.org or use Homebrew:
brew install node

# Verify installation:
node --version
npm --version
```

### Issue: "Blank page / Spinning loader"

**Solution:**
1. Check browser console (F12 > Console)
2. Look for error messages
3. Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
4. Clear browser cache:
   - Chrome: Settings > Privacy > Clear browsing data
   - Safari: Develop > Clear Caches

### Issue: Can't access from another device

**Solution for local development testing:**
```bash
# Find your computer's IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# You should see something like: inet 192.168.x.x

# Then on another device on same WiFi:
# http://192.168.x.x:3000
```

---

## 📱 Testing on Mobile Devices

### iOS (Same WiFi)

1. **Get your computer's IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Example: 192.168.1.100
   ```

2. **On iPhone/iPad Safari:**
   - Open Safari
   - Type: `http://192.168.1.100:3000`
   - Test the app
   - Tap Share > Add to Home Screen (optional)

### Android (Same WiFi)

1. **Get your computer's IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Example: 192.168.1.100
   ```

2. **On Android Chrome:**
   - Open Chrome
   - Type: `http://192.168.1.100:3000`
   - Test the app
   - Menu > Install app (optional)

---

## ✅ What to Test Locally

After the app loads, verify these work:

### Authentication
- [ ] Can see login screen
- [ ] Can enter phone number
- [ ] Can enter verification code
- [ ] Can enter PIN
- [ ] Can successfully log in

### Navigation
- [ ] Can tap tabs at bottom
- [ ] Can navigate between screens
- [ ] Back button works
- [ ] Swipe back works (on mobile)

### Tasks
- [ ] Can see task list
- [ ] Can tap a task
- [ ] Can see task details
- [ ] Can go back to list

### Forms
- [ ] Can fill form fields
- [ ] Can type text
- [ ] Can select from dropdowns
- [ ] Can submit form
- [ ] Can see success message

### Photos
- [ ] Can tap "Choose from Library"
- [ ] File picker opens
- [ ] Can select photo
- [ ] Photo appears in form

### Offline
- [ ] Turn off internet (or use DevTools throttle)
- [ ] App still works
- [ ] Can fill form
- [ ] Can submit (queues locally)
- [ ] Turn internet back on
- [ ] Data syncs

---

## 🛠️ Developer Tools

### Chrome DevTools (F12)

**Console Tab:**
- Check for JavaScript errors
- See console logs from app

**Network Tab:**
- Monitor API calls
- Check request/response times
- Verify Firebase calls

**Storage Tab:**
- View localStorage (settings)
- View IndexedDB (offline data)
- Check cache

**Performance Tab:**
- Record interactions
- Check for performance issues
- Monitor frame rate

### React DevTools Browser Extension

1. Install: Chrome Web Store or Firefox Add-ons
2. F12 > React tab
3. Inspect components
4. Check props and state

---

## 📊 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Blank white page | Build error | Check console (F12) for errors |
| Loading forever | Network issue | Check Network tab in DevTools |
| Can't access from mobile | Network separation | Verify same WiFi, use PC IP |
| Port already in use | Another process | Kill process using port |
| Module not found | Missing dependencies | Run `npm install` |
| Slow loading | Large bundle | Check Network tab, throttle test |
| Forms don't submit | Firebase error | Check console, verify credentials |
| Photos not uploading | File system issue | Try smaller file, check browser storage |

---

## 🚀 Next Steps

1. **Run locally:** `npm run web:full`
2. **Test features:** Use checklist above
3. **Test on mobile:** Use your phone on same WiFi
4. **Deploy:** Choose platform (Vercel/Firebase/etc)

---

## 📞 Quick Commands Reference

```bash
# Start development server (auto-reload)
npm run web

# Build production version
npm run web:build

# Serve production build
npm run web:serve

# Build AND serve (one command)
npm run web:full

# Clean and reinstall
rm -rf node_modules
npm install

# Clear build cache
rm -rf dist
npm run web:build
```

---

## 💡 Pro Tips

1. **Use production build for testing** - More accurate representation of live app
2. **Test on real phone** - Browser DevTools doesn't catch all issues
3. **Clear cache frequently** - Old cached data can cause issues
4. **Check console errors** - Always check F12 console for helpful error messages
5. **Test offline** - Most important feature to verify
6. **Test on slow network** - Use DevTools throttle (slow 4G)

---

**Ready to test?** Run `npm run web:full` and open `http://localhost:3000` 🚀
