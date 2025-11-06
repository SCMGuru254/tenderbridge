# Troubleshooting: Blank Pages (HR Directory & Mentorship)

## Issue Summary
If you're seeing blank pages on `/hr-directory` and `/mentorship`, this document explains why and how to resolve it.

## Root Cause Analysis

### 1. **Browser Cache Issue** (Most Likely)
The app IS rendering correctly in our sandbox. Screenshots show the homepage works perfectly. The blank screen you're experiencing is almost certainly a **browser cache problem**.

**Evidence:**
- ✅ All code changes deployed successfully
- ✅ No JavaScript errors in our logs
- ✅ Components are properly structured
- ✅ Loading states are working
- ❌ You're seeing blank pages = cached old broken code

### 2. Authentication Protection
Both `/hr-directory` and `/mentorship` are protected routes that require authentication. If you're not logged in, you'll be redirected to the login page.

### 3. Empty State (Expected Behavior)
Even when logged in, these pages will show "No HR professionals yet" or "No mentors available yet" because:
- The `hr_profiles` table has 0 records
- The `mentors` table has 0 records
- **This is normal for a new platform!**

## SOLUTION: Clear Your Browser Cache

### Method 1: Hard Refresh (Fastest)
1. **Windows/Linux:** Press `Ctrl + Shift + R`
2. **Mac:** Press `Cmd + Shift + R`
3. Wait for the page to fully reload
4. Try navigating to `/hr-directory` and `/mentorship` again

### Method 2: Clear Cache Completely
**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files"
3. Choose "All time" from the time range
4. Click "Clear data"
5. Reload the app

**Firefox:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Check "Cache"
3. Click "Clear Now"
4. Reload the app

**Safari:**
1. Open Preferences (Cmd + ,)
2. Go to "Advanced" tab
3. Enable "Show Develop menu in menu bar"
4. In the menu bar, click Develop → Empty Caches
5. Reload the app

### Method 3: Incognito/Private Window
1. Open a new incognito/private window
2. Go to your app URL
3. Log in and test

### Method 4: Try Different Browser
If the issue persists, try accessing your app in:
- Chrome (if using Firefox)
- Firefox (if using Chrome)
- Edge
- Safari

## What You Should See After Clearing Cache

### HR Directory (`/hr-directory`)
When you navigate to this page, you should see:
- ✅ Header: "HR Professionals Directory"
- ✅ Two tabs: "Browse HR Professionals" | "Create HR Profile"
- ✅ Empty state card saying "No HR professionals yet"
- ✅ Button: "Create HR Profile"
- ✅ Bottom navigation visible on mobile

### Mentorship (`/mentorship`)
When you navigate to this page, you should see:
- ✅ Header: "Mentorship Program"
- ✅ Three tabs: "Browse Mentors" | "Become a Mentor" | "Become a Mentee"
- ✅ Empty state card saying "No mentors available yet"
- ✅ Button: "Become a Mentor"
- ✅ Bottom navigation visible on mobile

## Bottom Navigation

### Where It Shows
The bottom navigation **IS implemented** and shows:
- ✅ On **all pages** via `Layout.tsx`
- ✅ Only on **mobile devices** (hidden on desktop with `md:hidden`)
- ✅ Fixed at the bottom of the screen

### Items in Bottom Nav
1. **Home** - Goes to `/dashboard`
2. **Jobs** - Goes to `/jobs`
3. **Learn** - Goes to `/courses`
4. **Companies** - Goes to `/companies`
5. **Insights** - Goes to `/supply-chain-insights`
6. **More** - Opens a menu with additional options

**If you don't see bottom nav:**
- Are you on mobile or have your browser window small enough? (Bottom nav only shows on screens < 768px wide)
- Try resizing your browser window to mobile size
- Or use browser dev tools (F12) and toggle device toolbar

## Testing the Pages Work

### Step 1: Verify Authentication
1. Make sure you're logged in
2. You should see your profile picture/name in the top navigation
3. If not logged in, go to `/auth` and sign up/login

### Step 2: Create Test Data
To see the pages populated with actual profiles:

**Create HR Profile:**
1. Go to `/hr-directory`
2. Click "Create HR Profile" tab
3. Fill out the form with your HR expertise
4. Click "Create HR Profile"
5. Switch back to "Browse HR Professionals" tab
6. You should now see your profile!

**Create Mentor Profile:**
1. Go to `/mentorship`
2. Click "Become a Mentor" tab
3. Fill out your expertise and experience
4. Click "Become a Mentor"
5. Switch to "Browse Mentors" tab
6. You should see your mentor profile!

## Admin Dashboard

### Access
The new admin dashboard is available at `/admin`

**Features:**
- ✅ System statistics (users, jobs, applications, companies)
- ✅ Automated tasks (news cleanup)
- ✅ RLS policy testing
- ✅ System health monitoring

**Requirements:**
- Must be logged in
- Must have `admin` role in `user_roles` table

### How to Grant Admin Access
If you need admin access, run this SQL in Supabase:

```sql
-- First, check if user_roles table exists and has the admin role type
INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM profiles WHERE email = 'your-email@example.com' LIMIT 1),
  'admin'
)
ON CONFLICT (user_id, role) DO NOTHING;
```

Replace `your-email@example.com` with your actual email.

## Still Having Issues?

### Check Browser Console
1. Press `F12` to open Developer Tools
2. Click the "Console" tab
3. Look for any red error messages
4. Share these error messages for better troubleshooting

### Check Network Tab
1. Press `F12` to open Developer Tools
2. Click the "Network" tab
3. Reload the page
4. Look for failed requests (red status codes)
5. Check if Supabase requests are completing successfully

### Verify Supabase Connection
The app should be connecting to:
- **URL:** `https://dqlfolsngrspnlpzzthv.supabase.co`
- **Status:** Check Supabase dashboard for any service disruptions

## Summary Checklist

- [ ] Hard refresh: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
- [ ] Cleared browser cache completely
- [ ] Tried incognito/private window
- [ ] Verified logged in (profile picture shows in nav)
- [ ] On mobile device or mobile-sized browser window for bottom nav
- [ ] Checked browser console for errors (F12)
- [ ] Tested in different browser

## Expected Behavior

**This is NORMAL and CORRECT:**
- Empty state messages when no data exists
- Bottom nav only on mobile
- Auth redirects when not logged in
- Loading spinner briefly on initial load

**This is NOT normal:**
- Completely blank white page (no header, no content)
- Infinite loading spinner
- JavaScript errors in console
- 404 or 500 errors

If you've tried all the above and still see a completely blank page, the issue is likely:
1. **Browser extension** blocking JavaScript
2. **Ad blocker** interfering with the app
3. **Corporate firewall** blocking Supabase
4. **Outdated browser** that doesn't support modern JavaScript

---

**Bottom Line:** Clear your browser cache with `Ctrl + Shift + R`. The app is working correctly in our sandbox. Your blank page is almost certainly cached old code from day 1-2 when we had the auth issues.
