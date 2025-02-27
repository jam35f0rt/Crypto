/**
 * Utility functions for the application
 */
const Utils = {
    /**
     * Format price with appropriate decimal places based on value
     * @param {number} price - The price to format
     * @returns {string} - Formatted price string
     */
    formatPrice(price) {
      if (price === null || price === undefined) return 'Loading...';
      
      if (price < 0.01) {
        return `$${price.toFixed(6)}`; // Show 6 decimal places for very small values
      } else if (price < 1) {
        return `$${price.toFixed(4)}`; // Show 4 decimal places for values under $1
      } else if (price < 1000) {
        return `$${price.toFixed(2)}`; // Show 2 decimal places for regular values
      } else {
        return `$${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`; // Add thousand separators for large values
      }
    },
    
    /**
     * Get yesterday's date in ISO format (YYYY-MM-DD)
     * @returns {string} - ISO date string
     */
    getYesterdayDate() {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date.toISOString().split('T')[0];
    },
    
    /**
     * Map cryptocurrency codes to full names
     * @param {string} code - The cryptocurrency code
     * @returns {string} - Full name or the original code if not found
     */
    getCryptoFullName(code) {
      const cryptoNames = {
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum',
        'XRP': 'Ripple',
        'LTC': 'Litecoin',
        'BCH': 'Bitcoin Cash',
        'ADA': 'Cardano',
        'DOT': 'Polkadot',
        'LINK': 'Chainlink',
        'XLM': 'Stellar',
        'DOGE': 'Dogecoin',
        'SOL': 'Solana',
        'MATIC': 'Polygon',
        'AVAX': 'Avalanche',
        'ATOM': 'Cosmos',
        'UNI': 'Uniswap',
        'ALGO': 'Algorand',
        'MANA': 'Decentraland',
        'AXS': 'Axie Infinity',
        'SAND': 'The Sandbox',
        'SHIB': 'Shiba Inu'
      };
      
      return cryptoNames[code] || code;
    },
    
    /**
     * Debounce function to limit how often a function can be called
     * @param {Function} func - The function to debounce
     * @param {number} wait - The timeout in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce(func, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },
    
    /**
     * Generate a random ID
     * @returns {string} - Random ID
     */
    generateId() {
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
    },
    
    /**
     * Check if device is mobile
     * @returns {boolean} - True if mobile device
     */
    isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  };