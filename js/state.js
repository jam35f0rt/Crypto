/**
 * State management for the application
 * Implements a simple publish-subscribe pattern
 */
const State = {
    /**
     * Application state data
     */
    data: {
      cryptoList: [],           // List of all available cryptocurrencies
      selectedCryptos: [],      // Cryptocurrencies the user is tracking
      favorites: [],            // IDs of favorited cryptocurrencies
      loading: true,            // Loading state
      error: null,              // Error message
      activeTab: 'all',         // Active tab ('all' or 'favorites')
      isOnline: navigator.onLine, // Online status
      deferredPrompt: null      // PWA install prompt event
    },
    
    /**
     * Get state value
     * @param {string} key - State key
     * @returns {*} - State value
     */
    get(key) {
      return this.data[key];
    },
    
    /**
     * Set state value and notify listeners
     * @param {string} key - State key
     * @param {*} value - New value
     */
    set(key, value) {
      this.data[key] = value;
      this.notifyListeners(key);
    },
    
    /**
     * Update a specific property in an array item
     * @param {string} arrayKey - State array key
     * @param {string} itemId - Item ID
     * @param {string} property - Property to update
     * @param {*} value - New value
     */
    updateInArray(arrayKey, itemId, property, value) {
      const array = this.data[arrayKey];
      const itemIndex = array.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        array[itemIndex][property] = value;
        this.notifyListeners(arrayKey);
      }
    },
    
    /**
     * Add item to array
     * @param {string} arrayKey - State array key
     * @param {*} item - Item to add
     */
    addToArray(arrayKey, item) {
      this.data[arrayKey].push(item);
      this.notifyListeners(arrayKey);
    },
    
    /**
     * Remove item from array
     * @param {string} arrayKey - State array key
     * @param {string} itemId - Item ID to remove
     */
    removeFromArray(arrayKey, itemId) {
      this.data[arrayKey] = this.data[arrayKey].filter(item => item.id !== itemId);
      this.notifyListeners(arrayKey);
    },
    
    /**
     * Toggle item in array (add if not present, remove if present)
     * @param {string} arrayKey - State array key
     * @param {string} itemId - Item ID to toggle
     */
    toggleInArray(arrayKey, itemId) {
      const index = this.data[arrayKey].indexOf(itemId);
      if (index === -1) {
        this.data[arrayKey].push(itemId);
      } else {
        this.data[arrayKey].splice(index, 1);
      }
      this.notifyListeners(arrayKey);
    },
    
    /**
     * State change listeners
     */
    listeners: {},
    
    /**
     * Add listener for state changes
     * @param {string} key - State key to listen for
     * @param {Function} callback - Function to call when state changes
     */
    addListener(key, callback) {
      if (!this.listeners[key]) {
        this.listeners[key] = [];
      }
      this.listeners[key].push(callback);
    },
    
    /**
     * Notify listeners of state changes
     * @param {string} key - State key that changed
     */
    notifyListeners(key) {
      if (this.listeners[key]) {
        this.listeners[key].forEach(callback => callback(this.data[key]));
      }
    }
  };