# Mobile Web Testing Checklist

Use this checklist to verify the app works properly on mobile web browsers.

## Pre-Testing Setup

### Local Development Testing
```bash
# Terminal 1: Start web server
npm run web

# Terminal 2: Create tunnel for remote access
npx ngrok http 19006
# Note the ngrok URL provided
```

### Device Setup
- **iOS**: Open Safari, navigate to ngrok URL
- **Android**: Open Chrome on same WiFi, navigate to `http://<YOUR_PC_IP>:19006`

---

## 🧪 Functional Testing

### Authentication
- [ ] Phone number input accepts numbers
- [ ] SMS code verification works
- [ ] PIN entry masks characters
- [ ] Admin login works
- [ ] Session persists after refresh
- [ ] Logout clears session
- [ ] Invalid credentials show error

### Navigation
- [ ] Bottom tabs responsive to touch
- [ ] Tab switching works smoothly
- [ ] Stack navigation (back/forward) works
- [ ] Deep linking works
- [ ] URLs update correctly

### Task Management
- [ ] Task list displays all tasks
- [ ] Can tap task to view details
- [ ] Task details show all information
- [ ] Can navigate back from details
- [ ] Pull-to-refresh updates tasks
- [ ] Task status changes reflect

### Forms
- [ ] Form fields display properly
- [ ] Can type in text fields
- [ ] Select dropdowns open/close
- [ ] Radio buttons toggle correctly
- [ ] Checkboxes toggle correctly
- [ ] Form validation shows errors
- [ ] Can submit form
- [ ] Success message appears

### Photos
- [ ] "Choose from Library" opens file picker
- [ ] Can select photo from gallery
- [ ] Photo appears in gallery grid
- [ ] Can remove photos
- [ ] Multiple photos can be added
- [ ] Photo count updates correctly
- [ ] Can view large photo

### Offline Features
- [ ] Toggle airplane mode (web: DevTools throttle)
- [ ] Form submission queues offline
- [ ] Offline banner appears
- [ ] Can work offline
- [ ] Data syncs when online
- [ ] Sync status shown

### Error Handling
- [ ] Network errors show toast
- [ ] Invalid input shows validation
- [ ] Server errors handled gracefully
- [ ] Errors don't crash app
- [ ] Can retry failed operations

---

## 📱 Device-Specific Testing

### iOS Safari

#### Home Screen App
- [ ] "Add to Home Screen" works
- [ ] App icon appears
- [ ] App name correct
- [ ] Splash screen displays
- [ ] Full screen mode (no Safari UI)
- [ ] Status bar visible
- [ ] Back button works
- [ ] Swipe back gesture works

#### Touch & Gestures
- [ ] All buttons responsive to touch
- [ ] No 300ms tap delay
- [ ] Scroll smooth and responsive
- [ ] Pinch zoom disabled (if intended)
- [ ] Long press doesn't trigger menu
- [ ] Double tap doesn't zoom

#### Keyboard
- [ ] Keyboard appears when needed
- [ ] Keyboard has correct input type
- [ ] Input not zoomed when focused
- [ ] Keyboard can dismiss
- [ ] No keyboard overlap

#### Safe Areas
- [ ] Content doesn't hide under notch
- [ ] Content doesn't hide under home indicator
- [ ] Buttons accessible in safe areas
- [ ] Landscape mode works

### Android Chrome

#### Home Screen App
- [ ] "Install app" or "Add to Home Screen" works
- [ ] App icon appears
- [ ] App name correct
- [ ] Splash screen displays
- [ ] Full screen mode
- [ ] Status bar visible
- [ ] Back button works
- [ ] Swipe back gesture works

#### Touch & Gestures
- [ ] All buttons responsive to touch
- [ ] Smooth scrolling
- [ ] Fast tap response
- [ ] Gesture navigation works
- [ ] Pull-down refresh works

#### Keyboard
- [ ] Keyboard appears when needed
- [ ] Correct input type keyboard
- [ ] Input not zoomed when focused
- [ ] Keyboard dismisses properly
- [ ] No keyboard overlap

#### Safe Areas
- [ ] Content visible (no system overlap)
- [ ] Buttons accessible
- [ ] Landscape mode works
- [ ] Notch/hole punch handled

---

## 🎨 Visual & Layout Testing

### Responsive Design
- [ ] Layout adapts to screen size
- [ ] Text readable on small screens
- [ ] Buttons easy to tap (44x44px+)
- [ ] No horizontal scrolling (unless intended)
- [ ] Images scale properly
- [ ] Spacing looks good

### Portrait & Landscape
- [ ] Portrait mode displays correctly
- [ ] Landscape mode displays correctly
- [ ] Rotation transitions smoothly
- [ ] Content reflows properly
- [ ] No cut-off content
- [ ] Keyboard handles both orientations

### Performance
- [ ] App loads in < 3 seconds
- [ ] Scrolling is smooth (60fps)
- [ ] Tap response is instant
- [ ] Form submission is quick
- [ ] No lag during animations
- [ ] Memory usage reasonable

### Visual Elements
- [ ] Colors display correctly
- [ ] Text is crisp and readable
- [ ] Images load properly
- [ ] Icons are clear
- [ ] Status bar visible
- [ ] Navigation clear

---

## 🔐 Security Testing

### Data Protection
- [ ] Passwords not visible in logs
- [ ] Tokens not logged
- [ ] Sensitive data not exposed
- [ ] No console errors with data
- [ ] Network requests encrypted

### Authentication
- [ ] Can't access app without login
- [ ] Can't bypass authentication
- [ ] Session timeout works
- [ ] Can't view other user's data

---

## 📊 Performance Profiling

### With Chrome DevTools

1. **Throttle Network** (Simulate 4G)
   - DevTools > Network tab
   - Select "Slow 4G"
   - Reload and measure load time

2. **Throttle CPU** (Simulate slower device)
   - DevTools > Performance tab
   - Set CPU throttle to 4x
   - Record and check frame rate

3. **Memory Usage**
   - DevTools > Memory tab
   - Record heap snapshot
   - Check for memory leaks
   - Compare offline vs online

4. **Lighthouse**
   - DevTools > Lighthouse tab
   - Run Mobile audit
   - Check Performance score
   - Address warnings

### Load Time Targets
- ⚡ First paint: < 1s
- ⚡ First interactive: < 2s
- ⚡ Full load: < 3s
- ⚡ Bundle size: < 5MB

---

## 🐛 Bug Tracking

For any issues found, note:

```
Device: iPhone 12 / Pixel 5
Browser: Safari / Chrome
Version: [version number]
OS: iOS 15 / Android 12
Issue: [description]
Steps to reproduce:
1.
2.
3.
Expected:
Actual:
Screenshots: [if applicable]
```

---

## ✅ Sign-Off Checklist

When all tests pass, confirm:

- [ ] Authentication works fully
- [ ] All screens display correctly
- [ ] Touch interactions responsive
- [ ] Forms submit successfully
- [ ] Photos upload and display
- [ ] Offline mode works
- [ ] Errors handled gracefully
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Device-specific issues resolved
- [ ] iOS Safari: ✅ PASS
- [ ] Android Chrome: ✅ PASS

---

## 🚀 Ready to Deploy!

When all tests pass, the app is ready for:
- [ ] Production web deployment
- [ ] User mobile web access
- [ ] Home screen app installation
- [ ] Offline use
- [ ] Public announcement

---

**Test Date**: _______________
**Tester**: _______________
**Status**: ✅ PASS / ⚠️ ISSUES FOUND

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________
