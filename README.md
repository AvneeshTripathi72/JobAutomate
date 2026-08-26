# Tilcons ATS + CRM

An all-in-one staffing platform for Indian recruitment agencies.

## Overview

Tilcons is a full-stack web application designed to serve as both an Applicant Tracking System (ATS) and a Customer Relationship Management (CRM) tool tailored for recruitment agencies.

## Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with Radix UI components and Framer Motion for animations
- **State/Data Fetching:** TanStack React Query & Wouter for routing
- **Forms:** React Hook Form with Zod validation

### Backend
- **Framework:** Node.js with Express
- **Database:** PostgreSQL (with `@neondatabase/serverless`)
- **ORM:** Drizzle ORM
- **Authentication:** Passport.js (Local strategy) with express-session
- **Integrations:** OpenAI API, Nodemailer, Microsoft Graph Client

### Shared
- **Schema:** Drizzle and Zod schemas shared between frontend and backend.

## Project Structure

- `/client/` - React frontend application.
  - `/src/components/` - Reusable UI components.
  - `/src/pages/` - Application pages/routes.
  - `/src/hooks/` - Custom React hooks.
  - `/src/lib/` - Utility functions.
- `/server/` - Express backend application.
  - `routes.ts` - API route definitions.
  - `storage.ts` - Data access layer.
  - `auth.ts` - Authentication setup.
  - `email.ts` - Email integration logic.
- `/shared/` - Shared types and database schemas (`schema.ts`).

## Scripts

- `npm run dev`: Starts the development server using Vite and tsx.
- `npm run build`: Builds the client using Vite and the server using esbuild.
- `npm start`: Starts the production server.
- `npm run check`: Runs TypeScript type checking.
- `npm run db:push`: Pushes schema changes to the database using Drizzle Kit.
- `npm run create-admin`: Script to create an admin user.
