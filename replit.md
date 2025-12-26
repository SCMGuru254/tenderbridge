# SupplyChain_KE - Replit Agent Guide

## Overview

SupplyChain_KE is a comprehensive supply chain job portal and professional networking platform focused on the Kenyan market. The platform provides job matching, career resources, mentorship programs, HR services, and community features for supply chain professionals. It's built as a hybrid mobile application using React with Vite for the web frontend and Capacitor for native iOS/Android deployment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Routing**: React Router with HashRouter (required for Capacitor mobile compatibility)
- **State Management**: React Query (TanStack Query) for server state, React Context for auth/navigation
- **UI Components**: shadcn/ui built on Radix UI primitives with Tailwind CSS styling
- **Mobile Wrapper**: Capacitor v6.2.1 for native iOS/Android builds

### Backend Architecture
- **Server**: Express.js running on Node.js with TypeScript (tsx loader)
- **API Pattern**: REST endpoints under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Supabase Auth (magic links, email/password, OAuth)

### Database Layer
- **Primary Database**: PostgreSQL via Supabase
- **Schema Definition**: Drizzle schema in `shared/schema.ts`
- **Tables**: jobs, profiles, companies (core tables defined in schema)
- **Row Level Security**: Enabled on Supabase tables for data protection

### Code Organization
```
src/                    # React frontend code
├── components/         # Reusable UI components
├── pages/             # Route page components (lazy loaded)
├── hooks/             # Custom React hooks
├── contexts/          # React Context providers
├── services/          # API and business logic services
├── integrations/      # External service integrations (Supabase)
server/                # Express backend
├── index.ts           # Server entry point
├── routes.ts          # API route definitions
├── storage.ts         # Database access layer
├── db.ts              # Drizzle database connection
shared/                # Shared code between frontend/backend
├── schema.ts          # Drizzle database schema definitions
```

### Key Design Patterns
- **Lazy Loading**: All page components use React.lazy() for code splitting
- **Protected Routes**: ProtectedRoute component wraps authenticated pages
- **Service Layer**: Business logic separated into service files
- **Error Boundaries**: ErrorBoundary component catches React errors gracefully

## External Dependencies

### Database & Authentication
- **Supabase**: PostgreSQL database, authentication, and storage
  - Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - Storage buckets for document uploads (resumes, profile images)

### AI Services
- **OpenAI**: Powers AI chat assistant, job matching, career advice
  - Environment variable: `VITE_OPENAI_API_KEY`
- **Hugging Face**: Alternative AI inference for some features
  - Environment variable: `VITE_HUGGINGFACE_API_KEY`

### External APIs
- **NewsAPI**: Supply chain news feed aggregation
  - Environment variable: `VITE_NEWS_API_KEY`
- **RapidAPI**: Job data aggregation from multiple sources
  - Stored in Supabase secrets

### Mobile Platform
- **Capacitor Plugins**:
  - `@capacitor/camera`: Profile photo capture
  - `@capacitor/splash-screen`: Native splash screen
  - `@capacitor/status-bar`: Native status bar control
  - `@capacitor/push-notifications`: Push notification support

### Email & Notifications (Planned)
- **SendGrid**: Email notifications for application status updates
  - Secret: `SENDGRID_API_KEY` in Supabase

### Build & Development
- **Vite PWA Plugin**: Progressive Web App support with service worker
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Strict type checking enabled