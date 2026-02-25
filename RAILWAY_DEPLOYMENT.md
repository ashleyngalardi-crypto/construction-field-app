# 🚀 Railway Deployment Guide - Gravel Log

**Domain:** gravellog.com
**Status:** ✅ Ready to deploy
**Estimated time:** 15 minutes

---

## Quick Start (Copy & Paste)

```bash
# 1. Setup GitHub remote (if not already done)
cd /Users/ashleygalardi/construction-field-app
git remote add origin https://github.com/YOUR_USERNAME/construction-field-app.git
git branch -M main
git push -u origin main

# 2. Go to Railway and deploy
# (See Step-by-Step below)
```

---

## Step-by-Step Deployment

### Step 1: Ensure Code is on GitHub

```bash
cd /Users/ashleygalardi/construction-field-app
git log --oneline | head -1
# Should show: Deploy Gravel Log with web navigation and branding
```

If not already pushed:
```bash
git remote add origin https://github.com/YOUR_USERNAME/construction-field-app.git
git push -u origin main
```

### Step 2: Deploy via Railway

**Visit:** https://railway.app

1. **Sign In** with GitHub (create account if needed)
2. **New Project → Deploy from GitHub repo**
3. **Select your repo:** `construction-field-app`
4. **Automatic configuration** (Railway auto-detects):
   - Build Command: `npm run web:build`
   - Publish Directory: `dist`

5. **Click Deploy** 🎉
   - Railway will build your app
   - Takes ~2-3 minutes
   - You'll get a Railway URL like: `https://construction-field-app-production.up.railway.app`

### Step 3: Connect Custom Domain (gravellog.com)

**In Railway Dashboard:**

1. **Select your project**
2. **Settings → Domains → Add Domain**
3. **Enter:** `gravellog.com`
4. **Copy the CNAME value** that Railway shows

**In Your Domain Registrar** (GoDaddy, Namecheap, etc.):

1. **Go to DNS Settings**
2. **Add/Edit CNAME Record:**
   ```
   Type: CNAME
   Name: @ (or leave blank)
   Value: [paste from Railway]
   TTL: 3600
   ```

3. **Save changes**
4. **Wait 5-15 minutes** for DNS to propagate

### Step 4: Verify Deployment

```bash
# After DNS propagates (5-15 min), visit:
https://gravellog.com

# You should see:
✅ Gravel Log welcome screen
✅ "I'm Crew" button (clickable)
✅ "I'm Admin" button (clickable)
✅ Orange branding
```

---

## What's Being Deployed

```
✅ Web app (Expo Web build)
✅ Gravel Log branding (fonts, colors, logo)
✅ Working web navigation
✅ All auth screens
✅ Redux state management
✅ Firebase integration
✅ PWA support
```

---

## Your Build Configuration

**Build Command:**
```bash
npm run web:build
```

**Output Directory:**
```
dist/
```

**Build Contents:**
- `dist/index.html` - App entry point
- `dist/_expo/` - JavaScript bundles
- `dist/assets/` - Images, icons, fonts
- `dist/manifest.json` - PWA manifest

---

## DNS Records (Reference)

When Railway shows you the CNAME, it will look something like:

```
Type: CNAME
Name: @
Value: cname.railway.internal
TTL: 3600
```

Add this to your domain registrar's DNS settings.

---

## Troubleshooting

### "Build failed"
- Check Railway logs for errors
- Ensure all environment variables are set
- Verify `npm run web:build` works locally

### "Domain not resolving"
- DNS can take 5-15 minutes to propagate
- Use `nslookup gravellog.com` to check
- Try clearing browser cache

### "Blank page or 404"
- Railway may need to rebuild
- Try clearing browser cache (Ctrl+Shift+Del)
- Check that `dist/` folder exists in build

### "Navigation buttons not working"
- Hard refresh: Ctrl+Shift+R
- Check browser console for errors
- Verify Redux is initialized

---

## Post-Deployment

### Test Everything
- [ ] Load https://gravellog.com
- [ ] Click "I'm Crew" button
- [ ] Navigate to phone auth
- [ ] Click "I'm Admin" button
- [ ] Navigate to admin login
- [ ] Test back button

### Monitor App
```bash
# View Railway logs
# (Go to Railway dashboard → Logs tab)
```

### Auto-Deploy Future Updates
Once connected, every `git push` to main automatically redeploys!

```bash
# To deploy updates:
git add .
git commit -m "Your changes"
git push origin main
# Railway automatically builds and deploys!
```

---

## DNS Records After Deployment

Once live, your DNS should show:

```
gravellog.com  CNAME  cname.railway.internal  3600
```

Test with:
```bash
nslookup gravellog.com
# or
dig gravellog.com
```

---

## Your Next Steps

1. ✅ Code committed to main
2. ⏳ Push to GitHub (if not done)
3. ⏳ Deploy via Railway.app
4. ⏳ Add DNS record at gravellog.com registrar
5. ⏳ Test at https://gravellog.com

**Estimated total time: 15 minutes**

---

## Support

- **Railway Help:** https://docs.railway.app
- **Domain Help:** Contact your registrar
- **Build Issues:** Check Railway build logs

---

**Status:** Code ready ✅ | Build tested ✅ | Ready for Railway ✅

Let me know when you've deployed and I can help verify everything works!
