# Supply Chain KE - Complete Deployment Guide

## 🚀 From Development to Play Store

---

## Part 1: Understanding Ports (IMPORTANT!)

### The Port Confusion Explained:

**Port 8080** → ONLY for Lovable's sandbox preview (where we are now)

**Local Development** → Use default port 5173 (or any port you want)

**Production APK** → NO PORT AT ALL! Runs from device storage via `capacitor://` scheme

### Why No Port in Production?
When you build an APK, your entire web app (HTML, CSS, JavaScript) gets **bundled inside the APK file**. The app runs directly from the device's file system - no server, no port, no internet required for the app shell!

---

## Part 2: Local Development Setup

### Step 1: Clone Your Project
```bash
# Export to GitHub first (use GitHub button in Lovable)
git clone https://github.com/YOUR_USERNAME/supply-chain-ke.git
cd supply-chain-ke
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Locally
```bash
npm run dev
```
App runs on `http://localhost:5173` ✅ (NOT 8080!)

---

## Part 3: Building Production APK

### Step 1: Build Production Assets
```bash
npm run build
```
Creates optimized files in `dist/` folder.

### Step 2: Add Android (First Time Only)
```bash
npx cap add android
```

### Step 3: Sync Code to Android
```bash
npx cap sync android
```

### Step 4: Open in Android Studio
```bash
npx cap open android
```

### Step 5: Build APK
In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Part 4: How Production APK Works

### The Magic: No Server Needed! 🎉

```
User Opens APK
    ↓
Files load from: capacitor://localhost (device storage)
    ↓
Native Splash (3s)
    ↓
Web Splash - Your logo (2.5s)
    ↓
Landing/Onboarding/Dashboard
```

**All files are INSIDE the APK:**
- HTML, CSS, JavaScript
- Images, fonts, assets
- React components

**Only needs internet for:**
- Supabase API calls
- Fetching dynamic data
- User authentication

---

## Part 5: Supabase Configuration

### Good News: Works Everywhere! ✅

Your `.env` configuration works in ALL environments:
```
VITE_SUPABASE_URL="https://dqlfolsngrspnlpzzthv.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGc..."
```

**Why?**
- Supabase uses public HTTPS URLs
- No localhost, no ports
- Same config for: Lovable, local dev, production APK

**No changes needed for production!** ✅

---

## Part 6: Capacitor Config Explained

### Your Current Config (CORRECT for Production):

```json
{
  "server": {
    "androidScheme": "capacitor",
    "iosScheme": "capacitor"
  }
}
```

This tells Android: "Run from device storage, not a server"

### Optional Dev Mode (for hot reload):
```json
{
  "server": {
    "url": "http://YOUR_COMPUTER_IP:5173",
    "cleartext": true
  }
}
```

Use this ONLY during development for instant updates. **Remove for production build!**

---

## Part 7: Play Store Release

### Step 1: Generate Signed Bundle

In Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Choose **Android App Bundle (AAB)**
3. Create keystore (keep it safe!)
4. Build release version

### Step 2: Increment Version

Update before each release:
```json
// package.json
"version": "1.0.1"
```

```gradle
// android/app/build.gradle
versionCode 2
versionName "1.0.1"
```

### Step 3: Prepare Assets

Required for Play Store:
- ✅ App Icon (you have this!)
- Screenshots (5-8 images)
- Feature Graphic (1024x500px)
- Privacy Policy URL
- App descriptions

### Step 4: Upload to Play Console

1. https://play.google.com/console
2. Create new app
3. Upload AAB
4. Fill store listing
5. Submit for review

---

## Part 8: Testing Before Release

### Essential Tests:

- [ ] Install APK on real device
- [ ] Test offline functionality
- [ ] Login/Signup flows
- [ ] All navigation works
- [ ] Splash screens display correctly
- [ ] Back button behavior
- [ ] Supabase API calls work
- [ ] No white screens!

---

## Part 9: Update Workflow

### When Making Changes:

```bash
# 1. Update code in your editor
# 2. Build
npm run build

# 3. Sync to Android
npx cap sync android

# 4. Open Android Studio
npx cap open android

# 5. Build new APK/AAB
# 6. Test
# 7. Upload to Play Store
```

---

## Part 10: Common Issues

### White Screen on APK?
- Clear app data and reinstall
- Check console: `adb logcat | grep -i chromium`

### Supabase Not Connecting?
- Verify `.env` file exists in project root
- Check Supabase dashboard for any issues

### Changes Not Showing?
- Always run `npm run build` before `npx cap sync`
- Clear Android Studio cache: Build → Clean Project

---

## Quick Command Reference

```bash
# Development
npm run dev                    # Local dev server

# Production Build
npm run build                  # Build assets
npx cap sync android          # Sync to Android
npx cap open android          # Open Android Studio

# Debugging
npx cap run android           # Run on device
adb logcat                    # View logs
adb devices                   # List connected devices

# Clean Install
npx cap copy android          # Force copy assets
```

---

## Summary: Your Questions Answered

### Q: Will port issue persist locally?
**A:** No! Port 8080 is ONLY for Lovable. Use port 5173 locally.

### Q: Is this a Supabase issue?
**A:** No! Supabase works everywhere. It uses public HTTPS URLs (no ports).

### Q: How does production APK work?
**A:** Your app bundles inside the APK. Runs from device storage using `capacitor://` scheme. No port needed!

### Q: Does Play Store version need port 8080?
**A:** Absolutely not! Production APK has NO server, NO port. Everything runs locally on the device.

---

## Your Current Setup Status

✅ Capacitor config: CORRECT for production

✅ Supabase config: CORRECT for all environments

✅ Splash screens: Configured properly

✅ App icon: Professional logo ready

✅ Port issue: Fixed (8080 only for Lovable)

**You're ready to build your APK!** 🚀

---

## Next Steps

1. Export project to GitHub
2. Clone locally
3. Run `npm install`
4. Run `npm run build`
5. Run `npx cap add android`
6. Build APK in Android Studio
7. Test on device
8. When satisfied → Build signed AAB for Play Store

**Need help?** Check Capacitor docs: https://capacitorjs.com/docs
