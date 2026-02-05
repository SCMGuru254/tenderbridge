# 🎭 Role & Payment Architecture - Supply Chain KE

## Overview

This document defines the complete role separation and payment flows for all user types.

---

## 1. User Roles (Stored in `user_roles` table)

| Role | Description | How Assigned | Payment Required |
|------|-------------|--------------|------------------|
| `job_seeker` | Candidates looking for jobs | Auto on signup | Free (Pro: KES 500/yr) |
| `employer` | SMEs posting 1-5 jobs | On Standard/Growth plan purchase | KES 2,500-5,000/yr |
| `hr_professional` | Recruiters, HR teams, agencies | On Enterprise plan purchase | KES 8,000/yr |
| `trainer` | Course instructors | On listing fee payment | 10% of course price |
| `affiliate` | Growth partners | On affiliate signup approval | Free (earns commission) |
| `admin` | Platform administrators | Manual assignment only | N/A |

---

## 2. Payment Streams by Role

### A. Job Seekers (B2C)

| Product | Price (KES) | Paystack Purpose | Table Updated |
|---------|-------------|------------------|---------------|
| Pro Membership | 500/year | `jobseeker_pro` | `jobseeker_pro_memberships` |
| CV Review (points) | 100 pts | N/A (points) | `redemption_requests` |
| Career Coaching (points) | 200 pts | N/A (points) | `redemption_requests` |
| Early Access (points) | 20 pts/job | N/A (points) | `job_early_access_purchases` |

**Pro Membership Features:**
- ✅ 24h Early Access to new jobs
- ✅ Verified Badge on profile
- ✅ Unlimited AI Chat

### B. Employers (B2B)

| Plan | Price (KES/yr) | Paystack Purpose | Features |
|------|----------------|------------------|----------|
| Standard | 2,500 | `employer_subscription` | Unlimited posts, Basic analytics |
| Growth | 5,000 | `employer_subscription` | + Gold Badge, Priority Search, Suggested Candidates, Affiliate Program |
| Enterprise | 8,000 | `employer_subscription` | + Featured Slots, Resume DB, Support, Review Responses |

**Additional One-off Payments:**
| Product | Price (KES) | Paystack Purpose |
|---------|-------------|------------------|
| Standard Boost | 200 | `job_boost` |
| Pro Boost | 500 | `job_boost` |
| Ultimate Boost | 2,500 | `job_boost` |
| Urgent Add-on | 50 | `job_boost` |
| Review Response Access | 2,000 | `review_response` |

### C. Trainers

| Product | Price | Paystack Purpose |
|---------|-------|------------------|
| Course Listing Fee | 10% of ticket price | `trainer_listing` |

### D. Affiliates

- **No payment TO platform** - affiliates EARN from the platform
- Commission rates: 10% (Silver) → 15% (Gold) → 18% (Platinum)
- Tracked in `affiliate_programs` and `affiliate_referrals`

---

## 3. Paystack Webhook Flow

```
User Pays → Paystack → paystack-webhook edge function
                              ↓
                    Check payment_purpose
                              ↓
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                    ↓
   employer_subscription  jobseeker_pro      trainer_listing
         ↓                    ↓                    ↓
   Create subscription    Create membership   Create subscription
         ↓                    ↓                    ↓
   Assign role            Assign role         Assign role
   (employer/hr_pro)      (job_seeker)        (trainer)
         ↓                    ↓                    ↓
   Send notification      Send notification   Activate course
```

---

## 4. Database Tables

### Core Role Tables
- `user_roles` - Role assignments with expiry tracking
- `employer_subscriptions` - B2B plan subscriptions
- `jobseeker_pro_memberships` - Pro membership tracking
- `trainer_subscriptions` - Trainer listing fees

### Helper Functions
- `has_role(user_id, role)` - Check if user has active role
- `assign_role_on_subscription(user_id, role, expires_at)` - Auto-assign roles
- `get_user_subscription_status(user_id)` - Get full subscription status

---

## 5. Frontend Integration

### Check User Role
```typescript
import { supabase } from '@/integrations/supabase/client';

// Check specific role
const { data } = await supabase.rpc('has_role', {
  _user_id: userId,
  _role: 'employer'
});

// Get full status
const { data: status } = await supabase.rpc('get_user_subscription_status', {
  p_user_id: userId
});
```

### Initiate Payment
```typescript
// Example: Employer subscription
const response = await fetch('https://api.paystack.co/transaction/initialize', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${PAYSTACK_PUBLIC_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: user.email,
    amount: 250000, // KES 2,500 in kobo
    metadata: {
      user_id: user.id,
      payment_purpose: 'employer_subscription',
      plan_type: 'standard',
      company_id: companyId
    }
  })
});
```

---

## 6. Admin Dashboard Access

Admins can:
- View all subscriptions
- Manually assign/revoke roles
- Approve pending affiliates
- Process manual M-Pesa claims
- View revenue analytics by category

---

## 7. Security Considerations

1. **Roles stored in separate table** - NOT on profiles (prevents privilege escalation)
2. **RLS enforced** - Users only see their own data
3. **Webhook signature verification** - Paystack signatures validated
4. **Role expiry tracking** - Subscriptions auto-expire
5. **Admin-only role assignment** - Only admins can manually assign roles
