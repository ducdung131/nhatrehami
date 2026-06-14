# 🌸 Nhà Trẻ Hạ Mi - Kindergarten Management System

A complete, modern kindergarten management web application built with Next.js 15, TypeScript, Supabase, and Prisma.

## ✨ Features

- **📊 Admin Dashboard** - Complete school management with statistics and charts
- **👶 Student Management** - CRUD operations with search and filter
- **📈 Growth Tracking** - Height, weight monitoring with visual charts
- **📋 Attendance Management** - Daily attendance with batch operations
- **📢 Announcements** - School-wide or class-specific notifications
- **👨‍👩‍👧 Parent Portal** - Parents can view their child's progress
- **🌓 Dark/Light Mode** - Full theme support
- **📱 Responsive Design** - Mobile, Tablet, Desktop

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 15, TypeScript, TailwindCSS v4 |
| UI | Custom components, Lucide Icons, Framer Motion |
| Charts | Recharts |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel + Supabase |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)

### 1. Clone and Install

```bash
git clone <repo-url>
cd NhaTreHaMi
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL, anon key, and service role key
3. Get the PostgreSQL connection string from Settings > Database

### 3. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### 4. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npm run db:seed
```

### 5. Setup Supabase Auth

In Supabase dashboard:
1. Go to Authentication > Users
2. Create users matching the seed data emails:
   - `admin@hami.vn` (password: `admin123456`)
   - `parent1@hami.vn` through `parent20@hami.vn` (password: `parent123456`)

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Public homepage
│   ├── login/page.tsx           # Login page
│   ├── admin/                   # Admin dashboard
│   │   ├── page.tsx             # Overview
│   │   ├── students/page.tsx    # Student management
│   │   ├── parents/page.tsx     # Parent management
│   │   ├── growth/page.tsx      # Growth tracking
│   │   ├── attendance/page.tsx  # Attendance
│   │   ├── announcements/       # Announcements
│   │   ├── reports/             # Reports
│   │   └── settings/            # Settings
│   ├── parent/                  # Parent portal
│   │   ├── page.tsx             # Overview
│   │   ├── growth/page.tsx      # Growth charts
│   │   ├── comments/page.tsx    # Teacher comments
│   │   └── notifications/       # Notifications
│   └── api/                     # API routes
├── components/
│   ├── public/                  # Public page components
│   ├── dashboard/               # Dashboard components
│   └── providers/               # Context providers
├── lib/
│   ├── prisma.ts                # Prisma client
│   ├── utils.ts                 # Utilities
│   └── supabase/                # Supabase clients
└── types/                       # TypeScript types
```

## 🎨 Design

- **Primary Color**: #FFB86C (Soft Orange)
- **Secondary Color**: #A8E6CF (Mint Green)
- **Background**: #FFF8F0 (Cream)
- **Typography**: Inter + Nunito (Google Fonts)
- **Style**: Modern SaaS, rounded corners, soft shadows, glass morphism

## 📧 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hami.vn | admin123456 |
| Parent | parent1@hami.vn | parent123456 |

## 🚢 Deployment

### Vercel
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Supabase
- Database and Auth are already hosted on Supabase
- No additional deployment needed

## 📜 License

© 2026 Nhà Trẻ Hạ Mi. All Rights Reserved.
