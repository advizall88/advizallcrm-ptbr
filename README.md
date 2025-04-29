# Advizall CRM

A comprehensive CRM designed for Advizall, a Chicago-based marketing agency that acquires and manages U.S. clients for various services.

## Features

- **Prospect Management**: Track leads through a simple pipeline until they become active clients
- **Client Management**: Store client information and sensitive credentials (visible only to privileged roles)
- **Meeting Scheduling**: Schedule meetings with Google Calendar integration with automatic Google Meet links
- **Project Tracking**: Track projects and tasks for clients
- **Role-Based Access**: Different permission levels for Users, Moderators, and Admins

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Row-Level Security)
- **Authentication**: Supabase Auth
- **Workflows**: N8n (for Google Calendar integration and automated emails)
- **Data Fetching**: TanStack Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Supabase account
- Google account (for Calendar/Meet integration)

### Installation

1. Clone the repository
```sh
git clone <repository-url>
cd advizall-flow-hub
```

2. Install dependencies
```sh
npm install
# or
pnpm install
```

3. Set up environment variables
```sh
cp .env.example .env
```
Edit the `.env` file and add your Supabase URL and anon key.

4. Set up Supabase
   - Create a new Supabase project
   - Run the SQL migrations (to be created)
   - Enable Row-Level Security policies
   - Configure authentication settings

5. Start the development server
```sh
npm run dev
# or
pnpm dev
```

### Database Setup

The database requires several tables to be created:
- `users`
- `prospects`
- `clients`
- `credentials`
- `projects`
- `tasks`
- `payments`
- `meetings`

Detailed SQL migrations will be provided in the future.

## Project Structure

```
src/
├── components/     # UI components
│   ├── ui/         # Base components (shadcn/ui)
│   └── layout/     # Layout components
├── contexts/       # React contexts for state management
├── hooks/          # Custom React hooks
├── lib/            # Utilities and configurations
│   └── supabase.ts # Supabase client and types
├── pages/          # Main application pages
├── services/       # API services for data fetching
└── main.tsx        # Application entry point
```

## Authentication and Authorization

This CRM implements a role-based access control system with three user roles:
- **User**: Regular salesperson / account exec with limited access
- **Moderator**: Senior staff / team lead with broader access
- **Admin**: System owner with full access to all features

## Deployment

To deploy this application:
1. Push to the main branch to trigger CI/CD pipeline
2. Deploy Supabase functions and migrations
3. Configure N8n for production

## License

This project is proprietary and confidential. Unauthorized copying, transferring, or reproduction of the contents of this project, via any medium, is strictly prohibited.
