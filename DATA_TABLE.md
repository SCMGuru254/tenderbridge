# Database Tables Documentation

## Complete list of all database tables in the SupplyChain KE platform

### User & Profile Management
- **profiles** - User profiles with personal information, role, skills, experience
- **anonymous_settings** - User preferences for anonymous posting
- **professional_profiles** - Detailed professional profiles for talent marketplace
- **professional_skills** - Skills linked to professional profiles
- **skills** - Master table for all available skills

### Jobs & Applications
- **jobs** - Job postings with details, requirements, and status
- **job_skills** - Skills required for specific jobs
- **job_applications** - Applications submitted by users for jobs
- **application_notifications** - Notifications for job application updates
- **hiring_decisions** - Employer decisions on candidates
- **saved_jobs** - Jobs bookmarked by users

### Companies & Reviews
- **companies** - Company profiles and information
- **company_reviews** - Reviews of companies by employees/candidates
- **company_review_replies** - Company responses to reviews
- **review_comments** - Comments on company reviews
- **review_helpful_votes** - Helpful vote tracking for reviews

### Courses & Learning
- **courses** - Training courses and educational content
- **course_categories** - Categories for organizing courses
- **course_enrollments** - Student enrollments in courses

### Mentorship
- **mentors** - Mentor profiles and availability
- **mentorship_sessions** - Scheduled mentorship sessions

### HR Services
- **hr_profiles** - HR professional profiles and services
- **hr_consultations** - Booked HR consultation sessions

### Rewards & Gamification
- **rewards_points** - User points balance
- **rewards_transactions** - History of point earnings and redemptions
- **rewards_catalog** - Available rewards for redemption
- **user_achievements** - Achievements earned by users
- **redemption_requests** - Requests for reward redemptions

### Discussions & Community
- **discussions** - Community discussion threads
- **discussion_comments** - Comments on discussions
- **discussion_likes** - Likes on discussions
- **discussion_shares** - Share tracking for discussions
- **discussion_bookmarks** - Bookmarked discussions by users

### Interview Resources
- **interview_questions** - Shared interview questions
- **interview_reviews** - Interview experience reviews
- **interview_sessions** - Practice interview sessions
- **interview_responses** - User responses in practice sessions

### Events
- **events** - Platform events and webinars
- **event_registrations** - User registrations for events

### Documents & Files
- **document_uploads** - User-uploaded documents (resumes, certificates)
- **ats_analyses** - ATS analysis results for resumes

### News & Content
- **blog_posts** - Blog articles and content
- **supply_chain_news** - Aggregated supply chain industry news

### Networking
- **connections** - User-to-user connections
- **follows** - User following relationships

### Talent Marketplace
- **skill_polls** - Employer polls for skill demand
- **skill_poll_votes** - Votes on skill demand polls

### Affiliate Program
- **affiliate_programs** - Affiliate program registrations
- **affiliate_referrals** - Referral tracking
- **affiliate_payouts** - Payout requests and processing

### Featured Clients
- **featured_clients** - Premium client/advertiser accounts

### Career Applications
- **career_applications** - Applications for platform careers
- **career_application_votes** - Community votes on career applications

## Table Relationships

### Core Relationships:
- Users (profiles) → Jobs (applications)
- Users (profiles) → Companies (reviews)
- Users (profiles) → Courses (enrollments)
- Users (profiles) → Mentors (sessions)
- Users (profiles) → HR Profiles (consultations)
- Users (profiles) → Discussions (posts, comments)
- Users (profiles) → Rewards (points, transactions)
- Users (profiles) → Documents (uploads)
- Users (profiles) → Skills (professional profiles)

### Many-to-Many Relationships:
- Jobs ↔ Skills (job_skills)
- Professional Profiles ↔ Skills (professional_skills)
- Users ↔ Users (connections, follows)
- Users ↔ Discussions (likes, bookmarks, shares)

## Security Features

All tables implement Row-Level Security (RLS) policies to ensure:
- Users can only access their own data
- Public data is viewable by everyone
- Sensitive operations require authentication
- Proper authorization checks for admin actions

## Audit Fields

Most tables include:
- `created_at` - Timestamp when record was created
- `updated_at` - Timestamp when record was last modified
- `id` - UUID primary key

## Status Fields

Many tables include status tracking:
- Jobs: draft, published, closed, filled
- Applications: pending, reviewing, accepted, rejected
- Reviews: pending, approved, flagged
- Courses: draft, published, full, completed, cancelled
