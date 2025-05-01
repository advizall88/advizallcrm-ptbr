# Advizall Flow Hub Migrations Registry

This file tracks all migrations applied to the Supabase database.

## Migrations

| Date | Migration File | Description |
|------|---------------|-------------|
| 2023-05-01 | `20230501000000_initial_schema.sql` | Initial database schema with core tables: users, prospects, clients, credentials, projects, tasks, payments, meetings |
| 2024-04-30 | `20240430_meetings_cal.sql` | Added Cal.com meetings integration table |

## Migration Details

### 20230501000000_initial_schema.sql

Initial schema setup with:
- Users management with role-based access control
- Prospects and clients tables for lead management
- Project management with tasks
- Credential storage
- Payment tracking
- Meeting scheduling
- Row Level Security (RLS) policies
- Triggers for timestamps
- Functions for user creation and prospect-to-client conversion

### 20240430_meetings_cal.sql

Cal.com integration schema:
- Added `cal_meetings` table to store data from Cal.com webhooks
- Fields for meeting details (title, description, start/end times)
- Support for attendee information
- Status tracking (confirmed, cancelled, rescheduled)
- Additional fields for notes, phone, and cancellation/reschedule reasons
- Indexes for efficient querying by email, status, and start time
- RLS policies for secure access control

## How to Apply Migrations

To apply migrations to a fresh database instance:

```bash
psql -U postgres -d your_database -f 20230501000000_initial_schema.sql
psql -U postgres -d your_database -f 20240430_meetings_cal.sql
```

Alternatively, through the Supabase dashboard:
1. Go to SQL Editor
2. Paste the migration SQL
3. Execute 