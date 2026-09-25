# Job Board

A full-stack job board application built with Next.js, React, TypeScript, and PostgreSQL.

The application combines job search, AI-powered features, resume processing, employer workflows, authentication, database management, automated notifications, and modern UI components into a single platform.

## Features

### Job Search

- Search and discover job opportunities
- Browse job listings
- Filter and manage job data
- Detailed job listing pages
- Personalized job recommendations

### AI-Powered Features

- AI-powered job search
- AI-assisted job matching
- Personalized job recommendations
- Automated processing of job-related data
- AI-powered resume processing
- Automatic resume-to-text transformation
- Display extracted resume content to the user

### Resume Processing

- Upload resumes
- Process uploaded resume files
- Extract resume content using AI
- Transform resumes into structured text
- Display processed resume content

### Employer Features

- Create and manage job listings
- Manage job-related data
- Structured job listing forms
- Rich text / Markdown content

### Notifications & Automation

- Automated job notifications
- Email notifications
- Background processing
- Event-driven workflows

### User Experience

- User authentication
- Protected application areas
- Responsive interface
- Dark mode
- Internationalization
- Loading and notification states
- Data tables
- Form validation

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide React
- TanStack React Table
- React Hook Form
- Zod
- next-themes

### Backend

- Next.js
- PostgreSQL
- Drizzle ORM
- Drizzle Kit

### Authentication

- Clerk

### AI

- Google GenAI
- Inngest Agent Kit

### Background Processing

- Inngest
- Inngest Agent Kit

### Email

- Resend
- React Email

### File Uploads

- UploadThing

### Internationalization

- next-intl

### Content

- MDX
- MDX Editor
- next-mdx-remote
- remark-gfm

### Utilities

- date-fns
- cmdk
- react-resizable-panels
- Sonner

## AI Integration

AI is an important part of the application and is used to improve the job search and resume processing experience.

The application uses Google GenAI for AI-powered functionality such as:

- Searching for relevant job opportunities
- Matching users with relevant jobs
- Processing job-related information
- Processing uploaded resumes
- Extracting resume information
- Transforming resume files into readable text
- Supporting automated job-related workflows

Inngest is used to handle background and asynchronous workflows related to AI processing and automated tasks.

## Authentication

Authentication and user management are implemented with Clerk.

Clerk provides:

- User authentication
- User sessions
- User management
- Protected application areas

## Database

The application uses PostgreSQL with Drizzle ORM.

Drizzle ORM is used for:

- Database queries
- Database schema management
- Type-safe database operations
- Database migrations

### Database Commands

Generate database migrations:

npm run db:generate

# Run database migrations:

npm run db:migrate

# Open Drizzle Studio:

npm run db:studio

## Background Jobs

The application uses Inngest for background processing and event-driven workflows.

# Start the local Inngest development server:

npm run inngest

The application uses background workflows for automated tasks such as AI processing and job notifications.

# Email

Email functionality is implemented using Resend and React Email.

The project includes a local email development environment:

npm run email

Email functionality can be used for automated job-related notifications and other application emails.

# Resume Uploads

Users can upload resume files through the application.

UploadThing is used to handle file uploads, while AI processing is used to extract and transform resume content into text that can be displayed and used by the application.

# Internationalization

The application uses next-intl to provide a multilingual application structure.

This allows the application interface and content to be adapted for different languages.

# Environment Variables

The application requires environment variables for services such as authentication, database access, AI, email, file uploads, and background processing.

Create a .env.local file in the project root and configure the required variables.

Example:

# Authentication

CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# Database

DATABASE_URL=

# AI

GEMINI_API_KEY=

# Email

RESEND_API_KEY=

# File uploads

UPLOADTHING_TOKEN=

# Inngest

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

Environment variable names may differ depending on the project configuration.

## Getting Started

1. Clone the repository
   git clone https://github.com/shevaand/job-board.git
2. Navigate to the project
   cd job-board
3. Install dependencies
   npm install
4. Configure environment variables

Create a .env.local file in the project root and add the required environment variables.

5. Start the development server
   npm run dev

## The application will be available at:

http://localhost:3000
Available Scripts
Development
npm run dev
Production Build
npm run build
Production Server
npm run start
Lint
npm run lint
Database
npm run db:push
npm run db:generate
npm run db:migrate
npm run db:studio
Inngest
npm run inngest
Email Development
npm run email

## Project Structure

job-board/
├── public/
│
├── src/
│ ├── app/
│ ├── components/
│ ├── db/
│ ├── services/
│ │ ├── resend/
│ │ └── ...
│ └── ...
│
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md

## What I Practiced

Building a full-stack application with Next.js
React and TypeScript
Next.js App Router architecture
Authentication with Clerk
PostgreSQL database integration
Type-safe database operations with Drizzle ORM
Database schema management and migrations
AI integration with Google GenAI
AI-powered job search
AI-powered resume processing
Background processing with Inngest
Event-driven application workflows
Automated job notifications
File uploads with UploadThing
Email services with Resend
React Email
Form handling with React Hook Form
Schema validation with Zod
Data tables with TanStack Table
Internationalization with next-intl
Dark mode
MDX and Markdown content
Responsive UI development
Environment variable management

## License

This project was created for learning and portfolio purposes.
