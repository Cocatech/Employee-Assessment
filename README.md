# TRTH Employee Assessment System

A comprehensive employee assessment and performance management system built with Next.js 14, integrated with SharePoint Online via Microsoft Graph API.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + Shadcn/UI
- **Authentication**: NextAuth.js v5 with Microsoft Entra ID
- **Backend Logic**: Server Actions
- **Database**: SharePoint Online Lists (via Microsoft Graph API)
- **Containerization**: Docker

## 📁 Project Structure

```
TRTH/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   └── health/        # Health check endpoint
│   │   ├── dashboard/         # Dashboard pages (protected)
│   │   ├── auth/              # Auth pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/UI components
│   │   └── layout/           # Layout components
│   ├── lib/                   # Utility functions & configurations
│   │   ├── auth/             # NextAuth configuration
│   │   ├── graph/            # Microsoft Graph client
│   │   └── utils.ts          # Helper utilities (cn, etc.)
│   ├── types/                 # TypeScript type definitions
│   ├── actions/              # Server Actions
│   └── middleware.ts         # Auth middleware
├── public/                    # Static assets
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose configuration
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.js            # Next.js configuration
```

## 🛠️ Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Docker (optional, for containerization)
- Azure AD App Registration with the following:
  - Client ID
  - Client Secret
  - Tenant ID
  - Microsoft Graph API permissions

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TRTH
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Azure AD and SharePoint configuration:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<generate-with-openssl>
   AZURE_AD_CLIENT_ID=<your-client-id>
   AZURE_AD_CLIENT_SECRET=<your-client-secret>
   AZURE_AD_TENANT_ID=<your-tenant-id>
   SHAREPOINT_SITE_ID=<your-site-id>
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🐳 Docker Deployment

### Build and run with Docker Compose

```bash
# Build the image
docker-compose build

# Run the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Build standalone Docker image

```bash
# Build
docker build -t trth-employee-assessment .

# Run
docker run -p 3000:3000 --env-file .env.local trth-employee-assessment
```

## 🔐 Azure AD Configuration

1. Register an application in Azure Portal
2. Configure the following API permissions:
   - `User.Read`
   - `Sites.Read.All` (or `Sites.ReadWrite.All` for write access)
3. Add redirect URI: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
4. Create a client secret and note it down

## 📋 SharePoint Lists Setup

Create the following lists in your SharePoint site:

### Assessments List
- Title (Single line of text)
- Description (Multiple lines of text)
- Type (Choice: self, manager, peer, 360)
- Status (Choice: draft, pending, in_progress, completed, approved)
- EmployeeId (Single line of text)
- AssessorId (Single line of text)
- PeriodStart (Date)
- PeriodEnd (Date)
- DueDate (Date)
- CompletedAt (Date)
- Score (Number)

## 🧪 Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm run start
```

## 📄 License

This project is proprietary and confidential.

## 🤝 Contributing

Please contact the development team for contribution guidelines.
