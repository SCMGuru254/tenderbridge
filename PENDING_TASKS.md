# Pending Tasks - Supply Chain KE

## 🚨 CRITICAL - PRODUCTION BLOCKERS

### 1. TypeScript Configuration Fix
- **Issue**: `Referenced project '/dev-server/tsconfig.node.json' may not disable emit`
- **Owner**: Platform Team
- **Status**: ⏳ Blocked (awaiting platform team)
- **Impact**: Build configuration error

---

## 🔥 HIGH PRIORITY - EMPLOYER WORKFLOW (NEW)

### Phase 1 - ✅ COMPLETED
- [x] EmployerDashboard component (view posted jobs, stats, edit/delete buttons)
- [x] EmployerApplicationsList component (view applicants per job, download resume)
- [x] Routes added: `/employer/dashboard` and `/employer/applicants/:jobId`

### Phase 2 - ✅ COMPLETED
- [x] Application status management (dropdown to change: pending → shortlisted → accepted/rejected)
- [x] Permission checks (employer can only manage own jobs)
- [x] Database updates working

### Phase 3 - ⏳ PENDING (NEXT)
- [ ] **Applicant Notifications System** (Email + In-App)
  - **What**: When employer changes app status → automatically notify applicant
  - **Components needed**:
    - Email template system
    - Email service integration (Resend or SendGrid)
    - Notification trigger on status update
    - In-app notification creation
  - **ETA**: 5-6 hours
  - **Dependencies**: Email service API key needed

---

## 🎨 ICON & ASSETS

### ✅ COMPLETED
- [x] Installed @capacitor/assets package
- [x] Generated Android native icons from resources/icon.svg
- [x] Icons now properly sized for all Android densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- [x] Adaptive icon support enabled
- [x] Added `npm run generate:assets` command

**Status**: All native Android icons are now correctly placed in `android/app/src/main/res/mipmap-*/`

---

## 📋 REMAINING TASKS (PRIORITIZED)

### Database Schema (NOT STARTED)
- [ ] Create `project_reviews` table
- [ ] Fix foreign key relationship for courses.instructor_id
- [ ] Add more course categories (20+ total)
- [ ] Create `training_events` table

### UI/UX Fixes (NOT STARTED)
- [ ] Fix Hire My Skill tabs overflow/smudging
- [ ] Fix Profile tabs CSS
- [ ] Adjust bottom navigation positioning for mobile visibility
- [ ] Add safe-area-inset-bottom for iOS devices

### Data Integration (NOT STARTED)
- [ ] Connect Hire My Skill to real database tables
- [ ] Add seed data for mentors (5-10 sample profiles)
- [ ] Add seed data for HR profiles (5-10 sample profiles)
- [ ] Add seed data for skills (50+ supply chain skills)
- [ ] Add seed data for courses (10+ initial courses)
- [ ] Trigger RSS feed refresh for Supply Chain Insights

### Feature Completion (NOT STARTED)
- [ ] Enable AI Gateway for Chat Assistant
- [ ] Add AI_CHAT edge function
- [ ] Verify all Document Generator sub-components
- [ ] Add Training Events feature to Courses page
- [ ] Add event calendar integration

### Navigation & Accessibility (NOT STARTED)
- [ ] Add footer links (Join Team, Privacy, Terms)
- [ ] Create dedicated "More" section in navigation
- [ ] Add breadcrumb navigation

### Documentation (NOT STARTED)
- [ ] Update PRD with all new features
- [ ] Create API documentation
- [ ] Add deployment checklist

| Task | Priority | ETA | Blocker? |
|------|----------|-----|----------|
| Applicant Notification System | HIGH | 5-6h | ⚠️ Yes |
| TypeScript Config Fix | CRITICAL | TBD | ⚠️ Yes |
| Bottom Navigation Fix | MEDIUM | 2h | ❌ No |
| UI/CSS Fixes (tabs) | MEDIUM | 3h | ❌ No |
| Database Schema Additions | MEDIUM | 2h | ❌ No |
| Seed Data Population | MEDIUM | 4h | ❌ No |
| AI Gateway Integration | MEDIUM | 3h | ❌ No |
| Navigation Improvements | LOW | 2h | ❌ No |
| Documentation Updates | LOW | 1h | ❌ No |

---

## 🎯 NEXT STEPS

1. **Add Email Service** (Choose one):
   - Option A: Resend.dev (recommended for startups)
   - Option B: SendGrid
   - Option C: AWS SES

2. **Implement Notification Logic**:
   - Create email template for status updates
   - Add trigger in application status update flow
   - Create in-app notification record

3. **Test**: Send test notification when changing application status

---

## 📌 NOTES

- All employer workflow Phase 1 & 2 components are complete and functional
- Android icon generation completed successfully
- Ready to proceed with notification system next
