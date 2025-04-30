/**
 * Advizall CRM Database Backup Script
 * 
 * This script creates a complete backup of all application data, including:
 * - LocalStorage mock database content
 * - Prospect and Client data
 * - Converted prospect tracking
 * - Authentication state
 * - Projects, Payments, and Credentials
 */

// Function to extract all localStorage data
function extractDatabaseData() {
  // Basic structure for the backup
  const backup = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    localStorage: {},
    mockData: {
      prospects: [],
      clients: [],
      projects: [],
      payments: [],
      credentials: [],
      convertedProspects: [],
      users: []
    },
    supabaseConfig: {
      url: process.env.SUPABASE_URL || '',
      anonKey: process.env.SUPABASE_ANON_KEY || '',
      serviceRole: process.env.SUPABASE_SERVICE_ROLE || ''
    }
  };

  // Get all mock data from localStorage
  if (typeof localStorage !== 'undefined') {
    // Save all localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          backup.localStorage[key] = value;

          // Parse JSON data for specific keys to include in the structured backup
          if (key === 'mockClients') {
            backup.mockData.clients = JSON.parse(value || '[]');
          }
          else if (key === 'convertedProspects') {
            backup.mockData.convertedProspects = JSON.parse(value || '[]');
          }
          else if (key === 'mockProjects') {
            backup.mockData.projects = JSON.parse(value || '[]');
          }
          else if (key === 'mockPayments') {
            backup.mockData.payments = JSON.parse(value || '[]');
          }
          else if (key === 'mockCredentials') {
            backup.mockData.credentials = JSON.parse(value || '[]');
          }
          else if (key === 'authState') {
            backup.mockData.users = JSON.parse(value || '{}');
          }
        } catch (error) {
          console.error(`Error processing localStorage key "${key}":`, error);
          backup.localStorage[key] = `[ERROR] Failed to process: ${error.message}`;
        }
      }
    }
  }

  // Include hardcoded mock data from the application
  try {
    // This requires the backup script to be run with Node in the application context
    // In a browser context, you would need to handle this differently
    const { prospectService } = require('../src/services/prospectService');
    const { clientService } = require('../src/services/clientService');
    
    // Add mock prospects if available
    if (prospectService && prospectService.MOCK_PROSPECTS) {
      backup.mockData.prospects = [...prospectService.MOCK_PROSPECTS];
    }
    
    // Add mock clients if available
    if (clientService && clientService.MOCK_CLIENTS) {
      if (backup.mockData.clients.length === 0) {
        backup.mockData.clients = [...clientService.MOCK_CLIENTS];
      }
    }
  } catch (error) {
    console.error('Error importing mock services:', error);
    backup.importErrors = error.message;
  }

  return backup;
}

// Function to save the backup to a file
function saveBackup(data) {
  const fs = require('fs');
  const path = require('path');
  
  // Create a filename with the current date and time
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
  const fileName = `advizall-db-backup-${timestamp}.json`;
  const filePath = path.join(__dirname, fileName);
  
  // Stringify the backup data with pretty formatting
  const jsonData = JSON.stringify(data, null, 2);
  
  // Write to the file
  fs.writeFileSync(filePath, jsonData);
  
  console.log(`Backup created successfully: ${fileName}`);
  console.log(`Location: ${filePath}`);
  return filePath;
}

// Run the backup process
try {
  console.log('Starting Advizall CRM database backup...');
  const backupData = extractDatabaseData();
  const filePath = saveBackup(backupData);
  console.log('Backup completed successfully!');
} catch (error) {
  console.error('Backup failed:', error);
}

// Export the functions for potential reuse
module.exports = {
  extractDatabaseData,
  saveBackup
}; 