# 🚀 Deployment Guide for Google Play Store

## IMPORTANT: Two Different Configs

### 1. **capacitor.config.json** (Development/Preview)
- Used for Lovable preview
- Contains `server.url` pointing to Lovable preview
- Keep this for development

### 2. **capacitor.config.production.json** (Production APK)
- Used for Google Play Store builds
- NO `server` section (loads from local files)
- Use this for building APK

## 📱 Building APK for Google Play Store

### Step 1: Build with Production Config

```bash
# Copy production config
cp capacitor.config.production.json capacitor.config.json

# Build the app
npm run build

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android
```

### Step 2: In Android Studio

1. **Build > Clean Project**
2. **Build > Rebuild Project**
3. **Build > Generate Signed Bundle / APK**
4. Choose **Android App Bundle (AAB)** for Play Store
5. Create/select signing key
6. Build Release AAB

### Step 3: After Building, Revert Config

```bash
# Restore development config (important!)
git checkout capacitor.config.json
```

## 🔐 Supabase Login Redirects Setup

### Step 1: Configure in Supabase Dashboard

Go to: `https://supabase.com/dashboard/project/dqlfolsngrspnlpzzthv/auth/url-configuration`

**Site URL:**
```
https://preview--tenderbridge.lovable.app
```

**Redirect URLs (add all of these):**
```
https://preview--tenderbridge.lovable.app/**
https://preview--tenderbridge.lovable.app/auth/callback
https://tenderbridge.lovable.app/**
https://tenderbridge.lovable.app/auth/callback
com.supplychainke.app://login-callback
com.supplychainke.app://**
https://app.supplychainke.com/**
https://app.supplychainke.com/auth/callback
```

### Step 2: Google OAuth Setup (if using Google login)

1. Go to Google Cloud Console
2. Configure OAuth 2.0 Client ID
3. Add authorized JavaScript origins:
   - `https://preview--tenderbridge.lovable.app`
   - `https://tenderbridge.lovable.app`
   - `https://dqlfolsngrspnlpzzthv.supabase.co`

4. Add authorized redirect URIs:
   - `https://dqlfolsngrspnlpzzthv.supabase.co/auth/v1/callback`

5. Add Client ID and Secret to Supabase:
   - Go to: Authentication > Providers > Google
   - Enable Google provider
   - Add Client ID and Secret

### Step 3: Mobile Deep Linking

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<activity android:name=".MainActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="com.supplychainke.app" />
    </intent-filter>
</activity>
```

## ✅ Production Checklist

- [ ] Test login/signup in preview (https://preview--tenderbridge.lovable.app)
- [ ] Configure all Supabase redirect URLs
- [ ] Set up Google OAuth if using Google login
- [ ] Copy capacitor.config.production.json before building
- [ ] Build signed release AAB (not APK for Play Store)
- [ ] Test APK on physical device
- [ ] Revert to development config after build
- [ ] Upload AAB to Google Play Console
- [ ] Configure Play Store listing
- [ ] Submit for review

## 🔄 Quick Build Commands

### For Preview/Development:
```bash
# Just work normally - preview uses capacitor.config.json
npm run dev
```

### For Production APK:
```bash
# One-liner to build with production config
cp capacitor.config.production.json capacitor.config.json && \
npm run build && \
npx cap sync android && \
git checkout capacitor.config.json
```

## 📝 Important Notes

1. **Never commit capacitor.config.json with production settings** - it will break preview
2. **AAB vs APK**: Google Play requires AAB format, not APK
3. **Signing Key**: Store your keystore file safely - you can't upload new versions without it
4. **First Upload**: First APK review takes 3-7 days
5. **Testing**: Use Internal Testing track before production release

## 🐛 Troubleshooting

### White screen in APK
- Check if you used production config (no server section)
- Run: `npm run build && npx cap sync android`
- Rebuild in Android Studio

### Login redirects not working
- Verify all URLs in Supabase dashboard
- Check Google OAuth configuration
- Ensure deep linking intent filter in AndroidManifest.xml

### Preview not loading
- Ensure capacitor.config.json has server.url pointing to Lovable preview
- Check console logs for errors
- Verify Supabase URL configuration includes preview domain
