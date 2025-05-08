/**
 * Advizall CRM Browser Database Restore Script
 * 
 * This script restores a database backup created with the backup-database-browser.js tool.
 * 
 * Usage:
 * 1. Open the browser console (F12 or right-click > Inspect > Console)
 * 2. Copy and paste this script, but don't execute it yet
 * 3. Modify the restoreBackupFromFile() function call at the bottom with your backup file
 *    or use the promptForBackupFile() function to select a file through a file picker
 * 4. Execute the modified script
 */

(function() {
  console.log('Advizall CRM database restore utility started');
  
  /**
   * Clears all localStorage data except for items in the excludeKeys array
   * @param {string[]} excludeKeys - Keys to preserve
   */
  function clearLocalStorage(excludeKeys = []) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !excludeKeys.includes(key)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove keys in a separate loop to avoid index shifting during removal
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`Cleared ${keysToRemove.length} items from localStorage`);
  }
  
  /**
   * Restores data from a backup object to localStorage
   * @param {Object} backup - The backup object to restore from
   * @param {boolean} clearFirst - Whether to clear localStorage before restoring
   * @param {string[]} excludeFromClear - Keys to exclude from clearing
   * @returns {Object} Results of the restore operation
   */
  function restoreFromBackup(backup, clearFirst = true, excludeFromClear = []) {
    console.log('Starting restore process...');
    
    if (!backup || typeof backup !== 'object') {
      throw new Error('Invalid backup data provided');
    }
    
    // Check backup version and format
    if (!backup.version || !backup.timestamp) {
      console.warn('Backup appears to be in an unexpected format. Proceeding anyway...');
    } else {
      console.log(`Restoring backup created at ${backup.timestamp} (version ${backup.version})`);
    }
    
    // Optionally clear localStorage first
    if (clearFirst) {
      clearLocalStorage(excludeFromClear);
    }
    
    const results = {
      success: true,
      restored: 0,
      errors: [],
      keys: []
    };
    
    // Restore localStorage items
    if (backup.localStorage && typeof backup.localStorage === 'object') {
      Object.entries(backup.localStorage).forEach(([key, value]) => {
        try {
          if (value !== null && value !== undefined) {
            localStorage.setItem(key, value);
            results.restored++;
            results.keys.push(key);
          }
        } catch (error) {
          console.error(`Error restoring key "${key}":`, error);
          results.errors.push({ key, error: error.message });
          results.success = false;
        }
      });
    }
    
    console.log(`Restore complete. ${results.restored} items restored with ${results.errors.length} errors.`);
    if (results.errors.length > 0) {
      console.warn('Errors occurred during restore:', results.errors);
    }
    
    return results;
  }
  
  /**
   * Restores a backup from a file
   * @param {File} file - The backup file to restore from
   * @returns {Promise<Object>} Results of the restore operation
   */
  function restoreBackupFromFile(file) {
    return new Promise((resolve, reject) => {
      if (!(file instanceof File)) {
        reject(new Error('A valid File object is required'));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = function(event) {
        try {
          const backupData = JSON.parse(event.target.result);
          const results = restoreFromBackup(backupData);
          
          if (results.success) {
            alert(`Restore successful! ${results.restored} items restored.\n\nThe page will now reload to apply changes.`);
            setTimeout(() => window.location.reload(), 1000);
          } else {
            alert(`Restore completed with ${results.errors.length} errors. Check console for details.`);
          }
          
          resolve(results);
        } catch (error) {
          console.error('Failed to parse backup file:', error);
          alert('Error: Failed to parse backup file. Make sure it is a valid JSON backup file.');
          reject(error);
        }
      };
      
      reader.onerror = function(error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
        reject(error);
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * Creates a file input for selecting a backup file
   * @returns {Promise<Object>} Results of the restore operation
   */
  function promptForBackupFile() {
    return new Promise((resolve, reject) => {
      // Create file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      
      // Handle file selection
      fileInput.onchange = function() {
        if (fileInput.files && fileInput.files[0]) {
          restoreBackupFromFile(fileInput.files[0])
            .then(resolve)
            .catch(reject)
            .finally(() => {
              document.body.removeChild(fileInput);
            });
        } else {
          reject(new Error('No file selected'));
          document.body.removeChild(fileInput);
        }
      };
      
      // Handle cancellation
      window.addEventListener('focus', function focusHandler() {
        setTimeout(() => {
          if (fileInput.files.length === 0) {
            window.removeEventListener('focus', focusHandler);
            document.body.removeChild(fileInput);
            reject(new Error('File selection cancelled'));
          }
        }, 1000);
      }, { once: true });
      
      // Trigger file selection dialog
      fileInput.click();
    });
  }

  // Make functions available in global scope for console usage
  window.advizallRestore = {
    restoreFromBackup,
    restoreBackupFromFile,
    promptForBackupFile,
    clearLocalStorage
  };
  
  // Start restore process with file prompt
  console.log('Please select a backup file to restore...');
  promptForBackupFile()
    .catch(error => {
      console.error('Restore process failed or was cancelled:', error);
    });
  
  return 'Restore utility initialized. You can also manually call window.advizallRestore.promptForBackupFile() to restart the process.';
})(); 