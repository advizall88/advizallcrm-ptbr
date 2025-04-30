# Advizall CRM Database Backup Tools

This directory contains tools for creating complete backups of the Advizall CRM database, including all data stored in localStorage and application state.

## Available Backup Methods

### 1. Browser-Based Backup (Recommended)

The browser-based method is the most reliable way to back up the application's current state since the application is primarily running in the browser with mock data stored in localStorage.

**To use the browser backup:**

1. Start the Advizall CRM application (`npm run dev`)
2. Navigate to any page in the application
3. Open the browser developer console (F12 or right-click > Inspect > Console)
4. Copy the entire contents of the `backup-database-browser.js` file
5. Paste it into the console and press Enter
6. A file named `advizall-db-backup-[timestamp].json` will automatically download

This backup includes:
- All localStorage data
- Structured data for clients, prospects, projects, etc.
- Metadata about the application state

### 2. Node.js Script (For Development)

The Node.js script is primarily for development and may require modifications to work correctly with the specific implementation.

**To use the Node.js backup:**

1. Make sure you have Node.js installed
2. Navigate to the project root directory
3. Run the script with Node:
   ```
   node backup/backup-database.js
   ```
4. A backup file will be created in the `backup` directory

## Backup Contents

The backup files contain:

- **timestamp**: When the backup was created
- **version**: Backup format version
- **localStorage**: Raw contents of all localStorage items
- **mockData**: Structured data extracted from localStorage:
  - `clients`: Client records
  - `prospects`: Prospect records
  - `convertedProspects`: IDs of prospects converted to clients
  - `projects`: Project records
  - `payments`: Payment records
  - `credentials`: Credential records
  - `users`: User information

## Restoring from Backup

To restore from a backup:

1. Open the browser console in the Advizall application
2. Run the following JavaScript (replace with your backup data):
   ```javascript
   // Load the backup file (you'll need to copy-paste the JSON content)
   const backup = {/* Your backup JSON data */};
   
   // Restore all localStorage items
   Object.entries(backup.localStorage).forEach(([key, value]) => {
     localStorage.setItem(key, value);
   });
   
   // Reload the application
   window.location.reload();
   ```

## Important Notes

- Always create a backup before making significant changes to the application
- The backup files contain sensitive information and should be stored securely
- In a production environment, backups would typically be handled by the database system (Supabase) 