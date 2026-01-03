# User Onboarding Workflows

This document outlines how users select their roles and navigate the platform
upon signing up.

## 1. The Common Entry Point

- **Where**: `/auth` (Sign Up / Sign In)
- **Action**: User creates an account via Email or Google.
- **Next**: System checks if `onboarding_completed` is true.
  - If **No**: Redirect to `/onboarding`.
  - If **Yes**: Redirect based on Role (see below).

## 2. The Onboarding Process (Role Selection)

- **Page**: `/onboarding`
- **Step 1**: "Choose Your Path"
  - **Options**:
    1. **Job Seeker** (Default)
    2. **Employer / Recruiter**
    3. **Growth Partner (Affiliate)**
- **Step 2-4**: Profile Details (Name, Skills, Bio).
- **Completion**: Saves profile and `user_type`.

## 3. Role-Based Navigation Flows

### Path A: Job Seeker (Candidate)

- **Selection**: User chooses "Job Seeker".
- **Destination**: `/dashboard` (Main Dashboard).
- **Access**: Jobs, Courses, Mentorship, AI Tools.

### Path B: Employer / Recruiter

- **Selection**: User chooses "Employer".
- **Destination**: `/company-signup` (First Time).
  - **Action**: User registers their Company (Name, Description, Location).
  - **Success**: Redirects to `/employer/dashboard`.
- **Returning Login**: Redirects directly to `/employer/dashboard` if Company
  exists.

### Path C: Growth Partner (Affiliate)

- **Selection**: User chooses "Growth Partner".
- **Destination**: `/affiliate`.
  - **First Time**: Shows "Join Affiliate Program" form.
  - **Returning**: Shows Affiliate Stats & Referral Links.

## 4. Switching Roles

Users can expand their capabilities after onboarding:

- **Candidates becoming Employers**: Go to **Profile** -> **Register Company**.
- **Candidates becoming Affiliates**: Go to **Menu** -> **Affiliate Program**.
