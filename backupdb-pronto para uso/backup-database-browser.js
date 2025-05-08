/**
 * Advizall CRM Browser Database Backup Script
 * 
 * This script creates a complete backup of all application data from the browser,
 * including localStorage and application state.
 * 
 * Usage:
 * 1. Open the browser console (F12 or right-click > Inspect > Console)
 * 2. Copy and paste this entire script
 * 3. The backup will automatically download as a JSON file
 */

(function() {
  console.log('Starting Advizall CRM browser database backup...');
  
  // Create backup object structure
  const backup = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    appInfo: {
      url: window.location.href,
      userAgent: navigator.userAgent
    },
    localStorage: {},
    mockData: {
      prospects: [],
      clients: [],
      projects: [],
      payments: [],
      credentials: [],
      convertedProspects: [],
      users: []
    }
  };
  
  // Extract all localStorage data
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
  
  // Try to capture global app state through React DevTools if available
  try {
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers) {
      backup.reactState = 'React DevTools hook is available, but state capture requires custom implementation';
    }
  } catch (e) {
    console.log('React DevTools not available');
  }
  
  // Create a downloadable file from the backup data
  const jsonData = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create a timestamp for the filename
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
  const fileName = `advizall-db-backup-${timestamp}.json`;
  
  // Create and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  
  console.log(`Backup completed and downloaded as ${fileName}`);
  return `Backup completed successfully! File: ${fileName}`;
})(); 