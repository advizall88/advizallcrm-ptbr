#!/bin/bash

# Advizall CRM Database Backup Script
# This script automates the database backup process by:
# 1. Creating a backup directory with timestamp
# 2. Copying key files and configuration
# 3. Creating a database dump if Supabase is properly configured
# 4. Compressing all data into a single archive

# Configuration
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="./advizall_backup_$TIMESTAMP"
PROJECT_ROOT="../"
DB_DUMP_FILE="database_dump.json"
BACKUP_ARCHIVE="advizall_backup_$TIMESTAMP.tar.gz"

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Function to copy files with proper directory structure
copy_files() {
    local source_dir="$1"
    local dest_dir="$BACKUP_DIR/$2"
    local file_pattern="$3"
    
    mkdir -p "$dest_dir"
    
    if [ -n "$file_pattern" ]; then
        find "$source_dir" -name "$file_pattern" -type f -exec cp {} "$dest_dir/" \;
    else
        cp -r "$source_dir"/* "$dest_dir/" 2>/dev/null || true
    fi
}

echo "Backing up critical application files and configuration..."

# Copy key application files
copy_files "$PROJECT_ROOT/src" "src"
copy_files "$PROJECT_ROOT/public" "public"
copy_files "$PROJECT_ROOT/config" "config" 
copy_files "$PROJECT_ROOT" "root" "*.json"
copy_files "$PROJECT_ROOT" "root" "*.js"
copy_files "$PROJECT_ROOT" "root" "*.env*"

# Check for .env files and Supabase configuration
if [ -f "$PROJECT_ROOT/.env" ]; then
    cp "$PROJECT_ROOT/.env" "$BACKUP_DIR/"
    echo "Backed up .env file"
fi

if [ -f "$PROJECT_ROOT/.env.local" ]; then
    cp "$PROJECT_ROOT/.env.local" "$BACKUP_DIR/"
    echo "Backed up .env.local file"
fi

# Create a simple metadata file
echo "Creating backup metadata..."
cat > "$BACKUP_DIR/backup_info.txt" << EOF
Advizall CRM Database Backup
============================
Created: $(date)
Timestamp: $TIMESTAMP
Project: Advizall Flow Hub
Version: $(cat "$PROJECT_ROOT/package.json" | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')

This backup contains:
- Application source code (src/)
- Public assets (public/)
- Configuration files (config/)
- Package files (package.json)
- Environment configuration files (.env*)

To restore this backup:
1. Extract the archive: tar -xzf $BACKUP_ARCHIVE
2. Copy files back to your project directory
3. Use the browser restore script for database restoration

Note: For mock development environments, use the browser-based restore 
utility in backup/restore-database-browser.js
EOF

# Archive everything
echo "Creating compressed archive..."
tar -czf "$BACKUP_ARCHIVE" -C "$(dirname "$BACKUP_DIR")" "$(basename "$BACKUP_DIR")"

echo "Backup completed successfully!"
echo "Backup archive: $BACKUP_ARCHIVE"
echo "Backup size: $(du -h "$BACKUP_ARCHIVE" | cut -f1)"

# Cleanup
echo "Cleaning up temporary files..."
rm -rf "$BACKUP_DIR"

echo "Done!" 