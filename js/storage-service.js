/**
 * Storage service for persisting application data
 */
const StorageService = {
    /**
     * Storage key for the application data
     */
    STORAGE_KEY: 'crypto-tracker-data',
    
    /**
     * Save application state to localStorage
     */
    saveToStorage() {
      try {
        const dataToSave = {
          selectedCryptos: State.get('selectedCryptos'),
          favorites: State.get('favorites'),
          version: Config.VERSION
        };
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
        console.log('Data saved to localStorage');
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    
    /**
     * Load application state from localStorage
     */
    loadFromStorage() {
      try {
        const savedData = localStorage.getItem(this.STORAGE_KEY);
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          
          // Set state with saved data
          State.set('selectedCryptos', parsedData.selectedCryptos || []);
          State.set('favorites', parsedData.favorites || []);
          
          console.log('Data loaded from localStorage');
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        
        // If there's an error, clear localStorage to prevent future errors
        this.clearStorage();
      }
    },
    
    /**
     * Clear application data from localStorage
     */
    clearStorage() {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('Storage cleared');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  };