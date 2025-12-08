# TRTH Employee Assessment System - Copilot Instructions

## Project Overview
This is an Employee Assessment System called 'TRTH' built with Next.js 14 (App Router) and TypeScript.

## Tech Stack
- **Framework**: Next.js 14 with App Router and Server Actions
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn/UI components
- **Authentication**: NextAuth.js v5 with Microsoft Entra ID (Azure AD)
- **Database**: SharePoint Online Lists via Microsoft Graph API
- **Containerization**: Docker with multi-stage builds

## Architecture Guidelines

### Folder Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (ui/ for Shadcn, layout/ for layout components)
- `src/lib/` - Utilities, configurations, and external service clients
- `src/types/` - TypeScript type definitions
- `src/actions/` - Server Actions for data mutations

### Code Conventions
1. Use Server Actions for all data mutations
2. Use the `cn()` utility from `@/lib/utils` for conditional class names
3. All SharePoint operations go through `@/lib/graph/sharepoint.ts`
4. Authentication checks use the middleware pattern
5. Components follow Shadcn/UI patterns and use CVA for variants

### Environment Variables
Required environment variables:
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `AZURE_AD_CLIENT_ID` - Azure AD App Client ID
- `AZURE_AD_CLIENT_SECRET` - Azure AD App Client Secret
- `AZURE_AD_TENANT_ID` - Azure AD Tenant ID
- `SHAREPOINT_SITE_ID` - SharePoint Site ID

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Docker
- Use multi-stage builds for production
- The app uses standalone output mode for Docker optimization
- Health check endpoint: `/api/health`
