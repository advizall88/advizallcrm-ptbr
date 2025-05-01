# Advizall CRM Database Backup

This directory contains tools and files for backing up the Advizall CRM database structure and data.

## Contents

- `types.ts`: TypeScript type definitions for all database tables and relationships
- `supabase-schema-backup.sql`: Complete SQL schema including tables, relationships, policies, and functions
- `backup.sh`: Bash script for creating a complete backup of the database
- `backup-database-browser.js`: JavaScript for browser-based backup of application data

## Latest Changes (May 2024)

The database structure has been updated to include a new `cal_meetings` table that stores meetings from Cal.com:

```typescript
cal_meetings: {
  id: string
  ical_uid: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  status: string
  attendee_name: string | null
  attendee_email: string | null
  meeting_url: string | null
  trigger_event: string
  note: string | null
  phone: string | null
  reschedule_reason: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
}
```

## Backup Methods

### Browser-Based Backup (Recommended)

1. Start the application
2. Open the browser's developer console (F12)
3. Paste and run the code from `backup-database-browser.js`
4. A JSON file containing the localStorage data and application state will be downloaded

### Node.js Script Backup (Development)

Run the backup script:

```bash
./backup.sh
```

This will create a complete backup of:
- Database schema (SQL)
- Type definitions (TypeScript)
- LocalStorage data (if available)

## Restoring from Backup

To restore from a backup:

1. For schema restoration: 
   ```bash
   psql -U postgres -d your_database_name -f supabase-schema-backup.sql
   ```

2. For browser data restoration:
   - Open the application
   - Open browser console
   - Load the backup JSON file and restore to localStorage

## Important Notes

- Always create a backup before making significant changes to the application
- Backup files contain sensitive information - store them securely
- In production, backups are typically managed by the database system (Supabase)

## Contribution Guidelines

When updating the database schema:
1. Create proper migrations in the Supabase project
2. Update the type definitions in `src/lib/database.types.ts`
3. Run the backup script to update this backup directory 