# 📋 Project Status & Pending Tasks

**Completeness:** ~85% (Core Ready, AI Complete, Monetization Logic Ready)

## 🔥 High Priority

- [ ] **Run SQL Scripts** (Critical forAPK/Admin/Notifications)
  - `fix_courses_rls.sql` (Fixes "Failed to load courses")
  - `create_video_management.sql` (Enables Admin Video Library)
  - `create_notifications_system.sql` (Enables Notifications)
- [ ] **Mobile App (APK)**
  - [x] CLI Build & Sync (Completed).
  - [x] Build APK (Verified ~27MB file generated).
  - [ ] **Action Required**: Install `app-debug.apk` on physical device.
- [x] **Admin Features**
  - [x] **Video Management UI**: Implemented `VideoManager` and
        `create_video_management.sql`. Ready.
  - [x] **Business Claims UI**: Implemented `CompanyClaims` and integrated into
        Admin Dashboard.

## 🚀 Upcoming Features (Glassdoor-Style)

- [ ] **Community & Reviews**
  - [ ] **Unclaimed Companies UI**: Allow users to add companies (Unclaimed).
  - [ ] **Claim Business UI**: "Claim This Business" button on company profile.
  - [ ] **Review Verification**: Enforce proof for reviews?

## 🛠 Technical Debt

- [x] **Notifications System**
  - [x] Backend: `create_notifications_system.sql` created.
  - [x] Frontend: `NotificationBell.tsx` integrated.
- [ ] **PWA Re-enable** (Service Worker)

---

_Ready for APK Rebuild._
