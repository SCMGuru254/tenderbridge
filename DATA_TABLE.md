# SupplyChain KE - Complete Database Schema Documentation

## Overview
This document provides a comprehensive overview of all 80+ database tables in the SupplyChain KE platform.

---

## Table of Contents
1. [User & Profile Management](#user--profile-management)
2. [Jobs & Applications](#jobs--applications)
3. [Companies & Reviews](#companies--reviews)
4. [Courses & Learning](#courses--learning)
5. [Mentorship](#mentorship)
6. [HR Services](#hr-services)
7. [Rewards & Gamification](#rewards--gamification)
8. [Discussions & Community](#discussions--community)
9. [Interview Resources](#interview-resources)
10. [Events](#events)
11. [Documents & Files](#documents--files)
12. [News & Content](#news--content)
13. [Networking & Connections](#networking--connections)
14. [Talent Marketplace](#talent-marketplace)
15. [Affiliate Program](#affiliate-program)
16. [Featured Clients](#featured-clients)
17. [Salary Data](#salary-data)
18. [Payments & Subscriptions](#payments--subscriptions)
19. [Notifications & Messages](#notifications--messages)

---

## 1. User & Profile Management

### `profiles`
Main user profile table with all user information.
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (matches auth.users) |
| email | text | User email |
| full_name | text | Full name |
| avatar_url | text | Profile picture URL |
| bio | text | User biography |
| location | text | User location |
| position | text | Current job title |
| company | text | Current company |
| skills | text | Comma-separated skills |
| experience_level | text | Entry/Mid/Senior |
| cv_url | text | Resume URL |
| linkedin_url | text | LinkedIn profile |
| visibility | text | public/private/connections |
| role | text | User role |
| allowed_roles | text[] | Permitted roles |

### `user_roles`
Role assignments for users (admin, employer, job_seeker, etc.)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Reference to user |
| role | text | Role name |

### `anonymous_settings`
Controls anonymous posting preferences.
| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | User reference |
| default_anonymous | boolean | Default posting mode |
| preferred_anonymous_name | text | Anonymous display name |

### `profile_views`
Tracks who viewed whose profile.
| Column | Type | Description |
|--------|------|-------------|
| viewer_id | uuid | Who viewed |
| profile_id | uuid | Profile viewed |
| viewed_at | timestamp | When viewed |

---

## 2. Jobs & Applications ✅ COMPLETE

### `jobs`
All job postings on the platform.
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Job title |
| description | text | Full description |
| location | text | Job location |
| salary_range | text | Salary information |
| job_type | enum | full_time/part_time/contract/internship |
| requirements | text[] | Job requirements |
| responsibilities | text[] | Job responsibilities |
| company_id | uuid | Company reference |
| posted_by | uuid | User who posted |
| is_active | boolean | Active status |
| hiring_timeline | text | Expected hiring time |
| notify_applicants | boolean | Send notifications |
| image_url | text | Job posting image |
| document_url | text | Additional document link |

### `job_applications` ✅
Applications submitted by job seekers.
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| job_id | uuid | Job reference |
| applicant_id | uuid | Applicant user |
| resume_url | text | Resume link |
| cover_letter | text | Cover letter |
| status | text | pending/reviewed/shortlisted/rejected |

### `job_skills`
Skills required for each job.
| Column | Type | Description |
|--------|------|-------------|
| job_id | uuid | Job reference |
| skill | text | Skill name |

### `job_bookmarks`
Saved/bookmarked jobs by users.
| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | User who saved |
| job_id | uuid | Job saved |

### `saved_jobs`
Alternative saved jobs table.
| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | User reference |
| job_id | uuid | Job reference |

### `job_reports`
Reported job postings.
| Column | Type | Description |
|--------|------|-------------|
| job_id | uuid | Reported job |
| reported_by | uuid | Reporter |
| reason | text | Report reason |
| status | text | Report status |

### `scraped_jobs`
Jobs fetched from external sources.
| Column | Type | Description |
|--------|------|-------------|
| title | text | Job title |
| company | text | Company name |
| location | text | Location |
| url | text | External URL |
| source | text | Source website |

---

## 3. Companies & Reviews

### `companies`
Registered companies on the platform.
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Company name |
| description | text | About company |
| website | text | Company website |
| location | text | Headquarters |
| user_id | uuid | Owner user |
| verification_status | enum | pending/verified/rejected |

### `company_reviews`
Reviews of companies by employees.
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| company_id | uuid | Company reviewed |
| user_id | uuid | Reviewer |
| rating | integer | Overall rating (1-5) |
| review_text | text | Review content |
| pros | text | Positive aspects |
| cons | text | Negative aspects |
| is_anonymous | boolean | Anonymous review |
| is_current_employee | boolean | Current/former employee |
| culture_rating | integer | Culture score |
| compensation_rating | integer | Pay score |
| work_life_balance_rating | integer | WLB score |
| career_growth_rating | integer | Growth score |
| management_rating | integer | Management score |

### `company_review_replies`
Company responses to reviews.

### `review_helpful_votes`
Votes on review helpfulness.

### `review_likes`
Likes on reviews.

### `review_reports`
Reported reviews.

### `review_comments`
Comments on reviews.

### `review_responses`
Responses to reviews.

---

## 4. Courses & Learning ✅ COMPLETE

### `courses`
Training courses offered.
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Course title |
| description | text | Course description |
| instructor_id | uuid | Instructor user |
| price | numeric | Course price |
| duration_hours | integer | Total hours |
| level | text | beginner/intermediate/advanced |
| format | text | online/in-person/hybrid |
| status | text | draft/published |
| max_students | integer | Capacity |
| start_date | timestamp | Start date |
| certificate_provided | boolean | Has certificate |

### `course_enrollments`
Student enrollments in courses.
| Column | Type | Description |
|--------|------|-------------|
| course_id | uuid | Course reference |
| student_id | uuid | Student user |
| status | text | enrolled/completed/dropped |
| rating | integer | Student rating |
| review | text | Student review |

### `course_categories`
Categories for courses.

---

## 5. Mentorship ✅ COMPLETE

### `mentors`
Registered mentors.
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | User reference |
| expertise_areas | text[] | Areas of expertise |
| experience_years | integer | Years of experience |
| hourly_rate | numeric | Rate per hour |
| bio | text | Mentor bio |
| rating | numeric | Average rating |
| is_active | boolean | Accepting mentees |

### `mentees`
Registered mentees.
| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | User reference |
| current_level | text | Career level |
| career_goals | text | Goals |
| areas_of_interest | text[] | Interest areas |

### `mentorship_sessions`
Scheduled mentorship sessions.
| Column | Type | Description |
|--------|------|-------------|
| mentor_id | uuid | Mentor reference |
| mentee_id | uuid | Mentee reference |
| session_date | timestamp | Scheduled date |
| duration_minutes | integer | Duration |
| status | text | scheduled/completed/cancelled |
| rating | integer | Session rating |
| notes | text | Session notes |

---

## 6. HR Services

### `hr_profiles`
HR professional profiles.

### `hiring_decisions`
Hiring decisions made by employers.

---

## 7. Rewards & Gamification ✅ COMPLETE

### `rewards_points`
User point balances.
| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | User reference |
| current_balance | integer | Current points |
| lifetime_earned | integer | Total earned |
| lifetime_spent | integer | Total spent |

### `rewards_transactions`
Point transaction history.
| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | User reference |
| transaction_type | text | earn/spend |
| points | integer | Points amount |
| description | text | Transaction description |
| source | text | Source of points |

### `rewards_catalog`
Available rewards for redemption.

### `redemption_requests`
Reward redemption requests.

### `user_achievements`
User achievements/badges.

---

## 8. Discussions & Community ✅ COMPLETE

### `discussions`
Community discussion threads.

### `discussion_comments`
Comments on discussions.

### `discussion_likes`
Likes on discussions.

### `discussion_bookmarks`
Bookmarked discussions.

### `discussion_shares`
Shared discussions.

### `polls`
Polls within discussions.

### `poll_options`
Poll answer options.

### `poll_votes`
Votes on poll options.

### `skill_polls`
Skills-related polls.

### `skill_poll_votes`
Votes on skill polls.

---

## 9. Interview Resources ✅ COMPLETE

### `interview_questions`
Crowd-sourced interview questions.

### `interview_reviews`
Interview experience reviews.

### `interview_sessions`
Practice interview sessions.

### `interview_responses`
Responses in practice sessions.

---

## 10. Events ✅ COMPLETE

### `training_events`
Training events and workshops.

### `event_registrations`
Event registrations.

---

## 11. Documents & Files ✅ COMPLETE

### `document_uploads`
User uploaded documents.

### `ats_analyses`
ATS analysis results.

---

## 12. News & Content ✅ COMPLETE

### `news_items`
News articles fetched from APIs.

### `supply_chain_news`
Supply chain specific news.

### `rss_feeds`
RSS feed sources.

### `blog_posts`
Platform blog posts.

---

## 13. Networking & Connections ✅ COMPLETE

### `connections`
User connections (like LinkedIn).
| Column | Type | Description |
|--------|------|-------------|
| user_id1 | uuid | Requester |
| user_id2 | uuid | Recipient |
| status | text | pending/accepted/rejected |

### `follows`
Following relationships.

---

## 14. Talent Marketplace

### `professional_profiles`
Freelancer/consultant profiles.

### `professional_skills`
Skills for professionals.

### `skills`
Master skills list.

### `projects`
Posted projects for freelancers.

### `project_proposals`
Proposals on projects.

### `project_contracts`
Awarded project contracts.

### `project_reviews`
Reviews of completed projects.

### `project_skills`
Skills for projects.

---

## 15. Affiliate Program ✅ COMPLETE

### `affiliate_programs`
Affiliate partnerships.

### `affiliate_referrals`
Referral tracking.

### `affiliate_payouts`
Payout requests.

---

## 16. Featured Clients ✅ COMPLETE

### `featured_clients`
Premium advertising clients.

---

## 17. Salary Data ✅ NEW

### `salary_submissions`
Crowd-sourced salary data for insights.
| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | Submitter |
| job_title | text | Position |
| company_name | text | Company |
| location | text | Location |
| salary_amount | numeric | Salary |
| salary_currency | text | Currency (KES) |
| salary_period | text | monthly/yearly |
| bonus_amount | numeric | Bonus |
| benefits | text[] | Benefits list |
| is_anonymous | boolean | Anonymous |
| experience_level | text | Level |
| years_experience | integer | Years |
| industry | text | Industry |
| department | text | Department |
| employment_type | text | Full-time/Part-time |

---

## 18. Payments & Subscriptions ✅ COMPLETE

### `paypal_payments`
PayPal payment records.

### `paypal_payouts`
PayPal payout records.

### `paypal_plans`
Subscription plans.

### `paypal_subscriptions`
Active subscriptions.

### `pricing_plans`
Platform pricing tiers.

---

## 19. Notifications & Messages ✅ COMPLETE

### `notifications`
User notifications.

### `application_notifications`
Job application notifications.

### `messages`
Direct messages.

### `newsletter_subscribers`
Newsletter subscriptions.

---

## 20. Career Applications

### `career_applications`
Applications to join the platform team.

### `career_application_votes`
Votes on career applications.

### `team_applications`
Team membership applications.

---

## Table Count Summary

| Category | Tables | Status |
|----------|--------|--------|
| User & Profile | 5 | ✅ |
| Jobs & Applications | 7 | ✅ |
| Companies & Reviews | 9 | ✅ |
| Courses & Learning | 3 | ✅ |
| Mentorship | 3 | ✅ |
| HR Services | 2 | ✅ |
| Rewards | 5 | ✅ |
| Discussions | 10 | ✅ |
| Interview | 4 | ✅ |
| Events | 2 | ✅ |
| Documents | 2 | ✅ |
| News | 4 | ✅ |
| Networking | 2 | ✅ |
| Talent Marketplace | 8 | ✅ |
| Affiliate | 3 | ✅ |
| Featured Clients | 1 | ✅ |
| Salary Data | 1 | ✅ NEW |
| Payments | 5 | ✅ |
| Notifications | 4 | ✅ |
| Career Apps | 3 | ✅ |
| **TOTAL** | **83** | ✅ |

---

## All Tables Verified in Database

1. affiliate_payouts ✅
2. affiliate_programs ✅
3. affiliate_referrals ✅
4. anonymous_settings ✅
5. application_notifications ✅
6. ats_analyses ✅
7. blog_posts ✅
8. career_application_votes ✅
9. career_applications ✅
10. companies ✅
11. company_review_replies ✅
12. company_reviews ✅
13. connections ✅
14. course_categories ✅
15. course_enrollments ✅
16. courses ✅
17. discussion_bookmarks ✅
18. discussion_comments ✅
19. discussion_likes ✅
20. discussion_shares ✅
21. discussions ✅
22. document_uploads ✅
23. event_registrations ✅
24. featured_clients ✅
25. follows ✅
26. hiring_decisions ✅
27. hr_profiles ✅
28. interview_questions ✅
29. interview_responses ✅
30. interview_reviews ✅
31. interview_sessions ✅
32. job_applications ✅
33. job_bookmarks ✅
34. job_reports ✅
35. job_skills ✅
36. jobs ✅
37. mentees ✅
38. mentors ✅
39. mentorship_sessions ✅
40. messages ✅
41. news_items ✅
42. newsletter_subscribers ✅
43. notifications ✅
44. paypal_payments ✅
45. paypal_payouts ✅
46. paypal_plans ✅
47. paypal_subscriptions ✅
48. poll_options ✅
49. poll_votes ✅
50. polls ✅
51. pricing_plans ✅
52. professional_profiles ✅
53. professional_skills ✅
54. profile_views ✅
55. profiles ✅
56. project_contracts ✅
57. project_proposals ✅
58. project_reviews ✅
59. project_skills ✅
60. projects ✅
61. redemption_requests ✅
62. review_comments ✅
63. review_helpful_votes ✅
64. review_likes ✅
65. review_reports ✅
66. review_responses ✅
67. rewards_catalog ✅
68. rewards_points ✅
69. rewards_transactions ✅
70. rss_feeds ✅
71. salary_submissions ✅ NEW
72. saved_jobs ✅
73. scraped_jobs ✅
74. skill_poll_votes ✅
75. skill_polls ✅
76. skills ✅
77. supply_chain_news ✅
78. team_applications ✅
79. training_events ✅
80. user_achievements ✅
81. user_roles ✅
82. visible_profiles ✅

---

## Security

All tables implement Row-Level Security (RLS) policies.

## Common Fields

Most tables include: `id` (uuid), `created_at`, `updated_at`

---

*Last updated: December 2024*
