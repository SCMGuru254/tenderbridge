# 💰 Supply Chain KE - Monetization & Rewards Master Plan

This document serves as the single source of truth for the platform's revenue
models, rewards ecosystem, and influencer programs.

## 1. Monetization Strategy (Revenue Streams)

### A. Employer & HR (B2B) - "Volume over Price"

We disrupt the market with extremely affordable pricing to capture the Solo
HR/SME market.

| Plan           | Price (Annual) | Features                                                                 | Status    |
| :------------- | :------------- | :----------------------------------------------------------------------- | :-------- |
| **Standard**   | **KES 2,500**  | Unlimited Job Posts, Basic Profile, Dashboard                            | ✅ Active |
| **Growth**     | **KES 5,000**  | Gold Badge, Priority Search, Suggested Candidates, **Affiliate Program** | ✅ Active |
| **Enterprise** | **KES 8,000**  | Featured Slots, Resume DB, Support, Review Responses                     | ✅ Active |

- **Job Boosting (One-off)**: Employers can pay extra to boost individual jobs
  (Standard/Pro/Elite packages).

### B. Professional Users (B2C)

- **Pro Membership**: **KES 500/year** or **Points Redemption**.
  - Features: Early Access (24h), Verified Badge, Unlimited AI Chat.
- **Ad Revenue**: Users watch ads to earn points. (Google AdMob / Native
  Config).

### C. Training & Courses

- **Pre-Paid Model**: Trainers pay **10% of ticket price** upfront as a listing
  fee.
- **Guarantee**: We approve course only after fee is verified.

---

## 2. Rewards Ecosystem (Win-Win)

Points are the internal currency driving engagement.

| Action (Minting)     | Points     | Frequency    | Code Reference                    |
| :------------------- | :--------- | :----------- | :-------------------------------- |
| **Daily Login**      | +5 pts     | Daily        | `awardDailyLogin` (Dashboard.tsx) |
| **Job Application**  | +10 pts    | Per Job      | `awardJobApplicationPoints`       |
| **Referral**         | +100 pts   | Per Signup   | `awardReferralPoints`             |
| **Profile Complete** | +25-50 pts | On Milestone | `checkProfileCompletion`          |
| **Ad View**          | +1 pt      | Per View     | Frontend Logic                    |

| Redemption (Burning) | Cost    | Benefit            | Status   |
| :------------------- | :------ | :----------------- | :------- |
| **Profile Boost**    | 50 pts  | 7 Days Visibility  | ✅ Ready |
| **CV Review**        | 100 pts | Manual Review      | ✅ Ready |
| **Early Access**     | 150 pts | See jobs 24h early | ✅ Ready |
| **Career Coaching**  | 200 pts | 30-min session     | ✅ Ready |

---

## 3. Influencer & Affiliate Program

Performance-based rewards for Growth Partners.

| Tier         | Commission | Requirement                       |
| :----------- | :--------- | :-------------------------------- |
| **Silver**   | 10%        | None (Starter)                    |
| **Gold**     | 15%        | >5,000 Followers OR >5 Sales/mo   |
| **Platinum** | 18%        | >15,000 Followers OR >20 Sales/mo |

**Tracking**: Unique ref links (e.g., `?ref=SCM_JANE`), 60-day cookie,
Last-click attribution.

---

## 4. Technical Architecture

### Database Schema (Supabase)

- **`jobs`**: Core table. Includes `is_featured`, `is_active`,
  `early_access_until`.
- **`affiliate_programs`**: Tracks partner tiers and codes.
- **`affiliate_referrals`**: Tracks individual referral events.
- **`job_boost_packages`**: Defines boost types and prices.
- **`job_early_access_purchases`**: Tracks user unlocks.
- **`reward_transactions`**: Ledger for all points.
- **`redemption_requests`**: Queue for manual fulfillments (CV review).
- **`manual_payment_claims`**: For M-Pesa verification.
- **`job_reports`**: Content moderation.

### Security

- **RLS (Row Level Security)**: Enabled on ALL tables.
- **Edge Functions**:
  - `document-generator`: AI Resume building.
  - `ats-checker`: Resume analysis.
- **Admin Dashboard**: "God Mode" view for verifications and high-level metrics.
