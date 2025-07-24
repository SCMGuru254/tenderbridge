# SupplyChain_KE - Product Requirements Document

## Overview
SupplyChain_KE is a comprehensive job platform specifically designed for supply chain professionals in Kenya and East Africa. The platform combines traditional job board functionality with AI-powered tools, community features, and professional development resources.

## Core Features & Pages

### 1. Landing & Authentication
- **Landing Page** (`/`) - Hero section, features overview, testimonials
- **Authentication** (`/auth`) - Login/Signup with email/password
- **Onboarding** (`/onboarding`) - User setup flow

### 2. Job Management
- **Jobs Page** (`/jobs`) - Main job listing with filters and search
- **Job Details** - Individual job view with application functionality
- **Dashboard** (`/dashboard`) - Personal dashboard with stats and activity
- **Saved Jobs** - Bookmarked positions

### 3. Professional Tools
- **AI Agents** (`/ai-agents`) - AI-powered career tools
- **Interview Prep** (`/interview-prep`) - Mock interviews and practice
- **ATS Checker** (`/ats-checker`) - Resume ATS optimization
- **Document Generator** (`/documents`) - CV and cover letter templates
- **Chat Assistant** (`/chat-assistant`) - AI career guidance

### 4. Community & Networking
- **Discussions** (`/discussions`) - Community forums with likes, comments, shares
- **Companies** (`/companies`) - Company directory with reviews
- **HR Directory** (`/hr-directory`) - HR professional profiles
- **Mentorship** (`/mentorship`) - Mentor matching and sessions
- **Profile** (`/profile`) - User profiles and networking

### 5. Growth & Monetization
- **Careers** (`/careers`) - Join the team (community voting system)
- **Rewards** (`/rewards`) - Points and achievement system
- **PayPal Portal** - Payment processing and payouts
- **Payment Success/Cancel** - Payment flow completion

### 6. Analytics & Insights
- **Analytics** (`/analytics`) - Job market insights and trends
- **Company Reviews** (`/company-reviews`) - Detailed company evaluations

## Database Tables (Supabase)

### User Management
- `profiles` - User profile information
- `follows` - User following relationships
- `hiring_decisions` - Employer hiring records

### Job System
- `jobs` - Posted job opportunities
- `scraped_jobs` - Aggregated jobs from external sources
- `job_applications` - User applications to jobs
- `job_bookmarks` - Saved jobs by users
- `job_skills` - Skills associated with jobs
- `job_reports` - Reported inappropriate jobs

### Community Features
- `discussions` - Forum discussions
- `discussion_comments` - Comments on discussions
- `discussion_likes` - Discussion likes/votes
- `discussion_bookmarks` - Saved discussions
- `discussion_shares` - Social sharing tracking

### Company System
- `companies` - Company profiles
- `company_reviews` - Employee reviews of companies

### Professional Services
- `hr_profiles` - HR professional directory
- `mentors` - Mentor profiles
- `mentees` - Mentee profiles
- `mentorship_sessions` - Scheduled mentoring sessions
- `interview_sessions` - Practice interview sessions
- `interview_responses` - Interview Q&A records
- `interview_questions` - Question bank
- `interview_reviews` - Interview experience reviews

### Documents & Content
- `document_uploads` - User document storage
- `blog_posts` - Content management
- `newsletter_subscribers` - Email subscribers

### Monetization
- `featured_clients` - Premium company partnerships
- `paypal_payments` - Payment tracking
- `paypal_payouts` - Payout management
- `paypal_plans` - Subscription plans
- `affiliate_programs` - Referral system
- `affiliate_referrals` - Tracking referrals
- `affiliate_payouts` - Commission payments

### Gamification
- `rewards_points` - User point balances
- `rewards_transactions` - Point earning/spending history
- `rewards_catalog` - Available rewards
- `redemption_requests` - Reward redemptions
- `user_achievements` - Achievement tracking

### Career Development
- `career_applications` - Team joining applications
- `career_application_votes` - Community voting

### Communication
- `messages` - Direct messaging system
- `application_notifications` - Job application alerts

## Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Query (TanStack)
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Authentication**: Supabase Auth with context provider

### Backend
- **Database**: Supabase PostgreSQL with RLS policies
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Edge Functions**: Deno-based serverless functions
- **External APIs**: OpenAI, News API, PayPal, LinkedIn

### Key Features Implementation

#### AI-Powered Tools
- Job matching algorithms
- Resume optimization
- Interview preparation
- Career guidance chatbot

#### Community Engagement
- Discussion forums with interactions (likes, comments, shares)
- Company review system
- Mentorship matching
- Professional networking

#### Job Aggregation
- Web scraping from multiple job boards
- Deduplication and quality filtering
- Real-time updates and notifications

#### Mobile Optimization
- Responsive design
- Mobile navigation menu
- Touch-friendly interactions
- PWA capabilities

## Data Sources & Integration

### Job Data
- **Primary Sources**: LinkedIn, Fuzu, BrighterMonday
- **Update Frequency**: Real-time scraping
- **Quality Control**: Deduplication and verification
- **Location Focus**: Kenya and East Africa

### External APIs
- **OpenAI**: AI-powered career tools
- **News API**: Industry insights
- **PayPal**: Payment processing
- **LinkedIn**: Professional data

## Security & Compliance

### Row Level Security (RLS)
- All tables protected with appropriate policies
- User data isolation
- Company data access controls
- Admin-only operations secured

### Data Protection
- User consent for data collection
- Secure document storage
- Encrypted sensitive information
- GDPR-compliant practices

## Hosting & Deployment

### Infrastructure
- **Frontend**: Lovable deployment
- **Database**: Supabase cloud
- **Edge Functions**: Supabase Edge Runtime
- **CDN**: Integrated content delivery
- **Domain**: Custom domain support

### Performance
- Lazy loading for components
- Image optimization
- Caching strategies
- Database query optimization

## Future Enhancements

### Planned Features
- Video interviewing
- Skill assessment tests
- Salary benchmarking
- Company culture matching
- Mobile app (React Native)
- API for third-party integrations

### Analytics & Insights
- User behavior tracking
- Job market trends
- Success rate metrics
- Platform performance monitoring