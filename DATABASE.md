# Supply Chain KE - Database Schema Documentation

## Overview

This document outlines the database schema for the Supply Chain KE platform,
including all tables, relationships, and Row Level Security (RLS) policies.

## Core Tables

### Profiles

**Purpose**: User profile information and settings

| Column               | Type    | Description                                |
| -------------------- | ------- | ------------------------------------------ |
| id                   | uuid    | Primary key, references auth.users         |
| full_name            | text    | User's full name                           |
| bio                  | text    | Professional bio                           |
| position             | text    | Job title                                  |
| company              | text    | Company name                               |
| avatar_url           | text    | Profile photo URL                          |
| cv_url               | text    | Resume/CV URL                              |
| cv_filename          | text    | Original CV filename                       |
| linkedin_url         | text    | LinkedIn profile URL                       |
| notify_on_view       | boolean | Email when profile is viewed               |
| onboarding_completed | boolean | Has completed onboarding                   |
| user_type            | text    | 'Job Seeker', 'Employer', 'Growth Partner' |

**RLS**: Users can read all profiles, update only their own

---

### Jobs & Applications

#### scraped_jobs

**Purpose**: External job postings fetched from job boards

| Column           | Type      | Description              |
| ---------------- | --------- | ------------------------ |
| id               | uuid      | Primary key              |
| title            | text      | Job title                |
| company          | text      | Company name             |
| location         | text      | Job location             |
| job_url          | text      | External application URL |
| description      | text      | Job description          |
| is_scam          | boolean   | Flagged as spam/scam     |
| social_shares    | jsonb     | Share count tracking     |
| source_posted_at | timestamp | Original post date       |

**RLS**: All users can read non-scam jobs

#### jobs

**Purpose**: Employer-posted jobs on platform

| Column       | Type    | Description                |
| ------------ | ------- | -------------------------- |
| id           | uuid    | Primary key                |
| title        | text    | Job title                  |
| company_id   | uuid    | References companies table |
| description  | text    | Job description            |
| requirements | text    | Job requirements           |
| salary_range | text    | Salary information         |
| location     | text    | Job location               |
| job_type     | text    | Full-time, Part-time, etc  |
| is_premium   | boolean | Boosted listing            |

**RLS**: All users can read, employers can create/update their own

#### saved_jobs

**Purpose**: User's saved/bookmarked jobs

| Column         | Type      | Description                        |
| -------------- | --------- | ---------------------------------- |
| id             | uuid      | Primary key                        |
| user_id        | uuid      | References auth.users              |
| job_id         | uuid      | References jobs table (nullable)   |
| scraped_job_id | uuid      | References scraped_jobs (nullable) |
| created_at     | timestamp | When saved                         |

**RLS**: Users can only see and manage their own saved jobs

#### job_application_tracker

**Purpose**: Track user's external job applications

| Column         | Type      | Description                                    |
| -------------- | --------- | ---------------------------------------------- |
| id             | uuid      | Primary key                                    |
| user_id        | uuid      | References auth.users                          |
| job_id         | uuid      | References jobs (nullable)                     |
| scraped_job_id | uuid      | References scraped_jobs (nullable)             |
| status         | text      | 'applied', 'interviewing', 'offer', 'rejected' |
| notes          | text      | User notes                                     |
| applied_at     | timestamp | Application date                               |
| updated_at     | timestamp | Last update                                    |

**RLS**: Users can only see and manage their own applications

---

### Content Moderation

#### content_reports

**Purpose**: User-submitted reports of inappropriate content

| Column       | Type      | Description                              |
| ------------ | --------- | ---------------------------------------- |
| id           | uuid      | Primary key                              |
| content_id   | uuid      | ID of reported content                   |
| content_type | text      | 'job', 'review', 'discussion', 'profile' |
| reported_by  | uuid      | References auth.users                    |
| reason       | text      | Report reason                            |
| details      | text      | Additional context                       |
| status       | text      | 'pending', 'approved', 'rejected'        |
| reported_at  | timestamp | Report timestamp                         |

**RLS**: Authenticated users can create, only admins can read/update

#### scheduled_reviews

**Purpose**: Content scheduled for automatic deletion

| Column        | Type      | Description                         |
| ------------- | --------- | ----------------------------------- |
| id            | uuid      | Primary key                         |
| content_id    | uuid      | Content to review/delete            |
| content_type  | text      | Type of content                     |
| report_id     | uuid      | References content_reports          |
| scheduled_for | timestamp | When to process                     |
| status        | text      | 'pending', 'completed', 'cancelled' |

**RLS**: Admin-only access

---

### Companies

#### companies

**Purpose**: Company profiles and information

| Column              | Type | Description                        |
| ------------------- | ---- | ---------------------------------- |
| id                  | uuid | Primary key                        |
| name                | text | Company name                       |
| description         | text | Company description                |
| website             | text | Company website                    |
| logo_url            | text | Company logo                       |
| industry            | text | Industry sector                    |
| size                | text | Company size                       |
| location            | text | HQ location                        |
| verification_status | text | 'unclaimed', 'claimed', 'verified' |

**RLS**: All can read, authenticated can create, owners can update

#### company_claims

**Purpose**: Business owner verification requests

| Column         | Type      | Description                       |
| -------------- | --------- | --------------------------------- |
| id             | uuid      | Primary key                       |
| company_id     | uuid      | References companies              |
| user_id        | uuid      | Claimant                          |
| business_email | text      | Domain email                      |
| documents_url  | text      | Verification docs                 |
| status         | text      | 'pending', 'approved', 'rejected' |
| submitted_at   | timestamp | Submission date                   |

**RLS**: Users can create, admins can approve/reject

#### company_reviews

**Purpose**: Employee reviews (Glassdoor-style)

| Column       | Type    | Description          |
| ------------ | ------- | -------------------- |
| id           | uuid    | Primary key          |
| company_id   | uuid    | References companies |
| user_id      | uuid    | Reviewer             |
| rating       | integer | 1-5 stars            |
| title        | text    | Review title         |
| review_text  | text    | Review content       |
| pros         | text    | Positive aspects     |
| cons         | text    | Negative aspects     |
| is_anonymous | boolean | Hide author          |

**RLS**: All can read, authenticated can create their own

---

### Monetization

#### rewards_points

**Purpose**: User rewards and referral tracking

| Column          | Type    | Description           |
| --------------- | ------- | --------------------- |
| id              | uuid    | Primary key           |
| user_id         | uuid    | References auth.users |
| points          | integer | Current balance       |
| lifetime_points | integer | Total earned          |
| referral_code   | text    | Unique referral code  |

**RLS**: Users can read own points, system updates

#### redemption_requests

**Purpose**: Points redemption to cash

| Column        | Type    | Description                                    |
| ------------- | ------- | ---------------------------------------------- |
| id            | uuid    | Primary key                                    |
| user_id       | uuid    | References auth.users                          |
| points_amount | integer | Points to redeem                               |
| cash_amount   | numeric | USD value                                      |
| phone_number  | text    | M-Pesa number                                  |
| status        | text    | 'pending', 'approved', 'completed', 'rejected' |

**RLS**: Users can create/read own, admins can update

#### salary_submissions

**Purpose**: Crowdsourced salary data

| Column           | Type    | Description        |
| ---------------- | ------- | ------------------ |
| id               | uuid    | Primary key        |
| user_id          | uuid    | Submitter          |
| job_title        | text    | Position           |
| company_name     | text    | Company (optional) |
| salary_amount    | numeric | Salary figure      |
| salary_currency  | text    | KES, USD, etc      |
| salary_period    | text    | monthly, yearly    |
| experience_level | text    | Entry, Mid, Senior |
| is_anonymous     | boolean | Hide submitter     |

**RLS**: All can read, authenticated can submit

---

### Learning & Community

#### courses

**Purpose**: Training courses and content

| Column           | Type    | Description                      |
| ---------------- | ------- | -------------------------------- |
| id               | uuid    | Primary key                      |
| title            | text    | Course title                     |
| description      | text    | Course description               |
| category_id      | uuid    | References course_categories     |
| difficulty_level | text    | Beginner, Intermediate, Advanced |
| price            | numeric | Course price (0 for free)        |

**RLS**: Public read access

#### discussions

**Purpose**: Community forum posts

| Column    | Type    | Description           |
| --------- | ------- | --------------------- |
| id        | uuid    | Primary key           |
| author_id | uuid    | References auth.users |
| title     | text    | Discussion title      |
| content   | text    | Discussion content    |
| tags      | text[]  | Topic tags            |
| is_spam   | boolean | Flagged as spam       |

**RLS**: All can read, authenticated can create/update own

---

## Indexes

Performance optimization indexes created:

- `idx_saved_jobs_user` on saved_jobs(user_id)
- `idx_tracker_user` on job_application_tracker(user_id)
- `idx_salary_submissions_job_title` on salary_submissions(job_title)
- `idx_salary_submissions_location` on salary_submissions(location)

## RLS Patterns

### User-Owned Content

```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

### Public Read, Authenticated Write

```sql
-- Read policy
USING (true)

-- Write policy  
WITH CHECK (auth.uid() IS NOT NULL)
```

### Admin-Only Access

```sql
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
)
```

## Edge Functions

### Content Management

- `handle-report` - Process content reports
- `cleanup-old-news` - Delete stale news articles

### Job Scraping

- `scrape-jobs` - Fetch jobs from external boards
- `google-news-scraper` - Fetch supply chain news

### AI Features

- `ats-checker` - Resume analysis
- `salary-api` - Salary data API endpoint

## Security Notes

1. **All tables have RLS enabled** - No table allows unrestricted access
2. **Service role** is used only in Edge Functions for admin operations
3. **Email verification** required for sensitive operations
4. **Rate limiting** implemented for reports and submissions
5. **Automatic spam detection** - 3+ reports trigger auto-moderation
