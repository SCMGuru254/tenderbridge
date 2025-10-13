# Mobile App Production Setup Guide

## ✅ ISSUE FIXED: APK Not Loading

### Problem
The APK was configured to load from `app.supplychainke.com` instead of bundled local files.

### Solution Applied
Removed the `server` section from `capacitor.config.json` so the APK loads from local assets.

## 🔧 Steps to Rebuild Your APK

```bash
# 1. Clean previous builds
npm run build

# 2. Sync Capacitor (this copies dist to android/app/src/main/assets/public)
npx cap sync android

# 3. Open Android Studio
npx cap open android

# 4. In Android Studio:
#    - Build > Clean Project
#    - Build > Rebuild Project
#    - Build > Build Bundle(s) / APK(s) > Build APK(s)
```

## 📱 Android Permissions Setup

### Location: `android/app/src/main/AndroidManifest.xml`

Add these permissions before the `<application>` tag:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Internet & Network -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Camera Permission -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    
    <!-- File Storage Permissions -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
                     android:maxSdkVersion="32" />
    
    <!-- For Android 13+ (API 33+) -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    
    <!-- Notifications -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- Location (if needed for your app) -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application ...>
        <!-- Your existing app config -->
    </application>
</manifest>
```

## 📸 Camera Integration in Code

### Install Capacitor Camera Plugin

```bash
npm install @capacitor/camera
npx cap sync
```

### Example Usage in React Component

```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const takePicture = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });
    
    // Use image.webPath to display
    console.log('Image URI:', image.webPath);
  } catch (error) {
    console.error('Camera error:', error);
  }
};
```

## 📂 File Picker Integration

### Install Capacitor Filesystem Plugin

```bash
npm install @capacitor/filesystem
npx cap sync
```

### Example File Selection

```typescript
import { Filesystem, Directory } from '@capacitor/filesystem';

const selectFile = async () => {
  try {
    // For file picker, use HTML input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Process file
        console.log('Selected file:', file.name);
      }
    };
    input.click();
  } catch (error) {
    console.error('File selection error:', error);
  }
};
```

## 💰 Google Ads Integration with Rewards System

### Step 1: Install AdMob Plugin

```bash
npm install @capacitor-community/admob
npx cap sync
```

### Step 2: Configure AdMob

**android/app/src/main/AndroidManifest.xml:**
```xml
<application>
    <!-- Add your AdMob App ID -->
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-YOUR_ADMOB_APP_ID"/>
</application>
```

### Step 3: Create Reward Ad Component

We need to:
1. Create a hook to show reward ads
2. Track ad completion in Supabase
3. Credit user rewards points

### Implementation Plan:

**Database Table Needed:**
```sql
CREATE TABLE ad_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ad_type TEXT NOT NULL, -- 'rewarded_video', 'interstitial'
  points_earned INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

**React Hook for AdMob:**
```typescript
import { AdMob, RewardAdOptions } from '@capacitor-community/admob';

export const useRewardAd = () => {
  const showRewardAd = async () => {
    try {
      const options: RewardAdOptions = {
        adId: 'ca-app-pub-3940256099942544/5224354917', // Test ID
        // Replace with your actual Ad Unit ID in production
      };
      
      await AdMob.prepareRewardVideoAd(options);
      const result = await AdMob.showRewardVideoAd();
      
      if (result.value) {
        // User watched the ad, credit rewards
        await creditRewards(50); // 50 points per ad
      }
    } catch (error) {
      console.error('Ad error:', error);
    }
  };
  
  return { showRewardAd };
};
```

### Step 4: Link to Rewards System

The rewards system should:
1. Track ad views in `ad_rewards` table
2. Update user's total points in `user_rewards` table
3. Show toast notification: "You earned 50 points!"
4. Allow redemption for job boosts, premium features, etc.

## 🔐 Runtime Permissions Request

Permissions are requested automatically when you try to use them, but you can also request proactively:

```typescript
import { Camera } from '@capacitor/camera';

const requestCameraPermission = async () => {
  const permission = await Camera.checkPermissions();
  if (permission.camera === 'prompt' || permission.camera === 'denied') {
    await Camera.requestPermissions({ permissions: ['camera'] });
  }
};
```

## ✅ Checklist Before Building Production APK

- [ ] Remove or comment out `server` section in capacitor.config.json
- [ ] Run `npm run build` to create fresh dist folder
- [ ] Run `npx cap sync android` to copy assets
- [ ] Add all required permissions to AndroidManifest.xml
- [ ] Test on physical device or emulator
- [ ] Configure proper AdMob App ID (not test ID)
- [ ] Set up Google Play Developer account
- [ ] Create app signing key for release build
- [ ] Build signed release APK/AAB

## 🚀 For Play Store Release

```bash
# Generate release build
cd android
./gradlew bundleRelease

# Output will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

## 📝 Notes

1. **Development vs Production:** 
   - Development: Can use `server.hostname` for live reload
   - Production: Remove `server` section completely

2. **Permissions:**
   - Declared in AndroidManifest.xml (compile-time)
   - Requested at runtime via Capacitor plugins
   - Users see permission dialogs when feature is first used

3. **Google Ads:**
   - Requires Google AdMob account
   - Must comply with Google's ad policies
   - Test ads IDs work without account setup
   - Production requires app review and approval

4. **File Size:**
   - Keep APK under 100MB for Play Store
   - Use AAB (Android App Bundle) for optimized delivery
   - Consider code splitting for large apps
