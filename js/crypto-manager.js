/**
 * Cryptocurrency management service
 */
const CryptoManager = {
    /**
     * Add cryptocurrency to tracked list
     */
    addCrypto() {
      const cryptoSearch = document.getElementById('crypto-search');
      const selectedId = cryptoSearch.getAttribute('data-selected');
      
      if (!selectedId) {
        State.set('error', 'Please select a cryptocurrency from the dropdown');
        return;
      }
      
      const crypto = State.get('cryptoList').find(c => c.id === selectedId);
      if (crypto) {
        // Add to selected cryptos array
        State.addToArray('selectedCryptos', {
          id: crypto.id,
          name: crypto.name,
          price: null,
          change: null,
          loading: true
        });
        
        // Fetch price data
        ApiService.fetchPriceData();
        
        // Clear the search input and selected data
        cryptoSearch.value = '';
        cryptoSearch.removeAttribute('data-selected');
        document.getElementById('search-results').style.display = 'none';
        
      } else {
        State.set('error', 'Could not find the selected cryptocurrency. Please try again.');
      }
    },
    
    /**
     * Remove cryptocurrency from tracked list
     * @param {string} id - Cryptocurrency ID
     */
    removeCrypto(id) {
      // Remove from selected cryptos
      State.removeFromArray('selectedCryptos', id);
      
      // Also remove from favorites if present
      if (State.get('favorites').includes(id)) {
        State.removeFromArray('favorites', id);
      }
      
      // Save to storage
      StorageService.saveToStorage();
    },
    
    /**
     * Toggle cryptocurrency as favorite
     * @param {string} id - Cryptocurrency ID
     */
    toggleFavorite(id) {
      // Add to favorites if not present, remove if present
      State.toggleInArray('favorites', id);
      
      // Save to storage
      StorageService.saveToStorage();
    },
    
    /**
     * Fetch latest price data for all selected cryptocurrencies
     */
    refreshPrices() {
      if (State.get('selectedCryptos').length > 0) {
        ApiService.fetchPriceData();
      }
    },
    
    /**
     * Set up auto-refresh for prices
     */
    setupAutoRefresh() {
      // Refresh every minute
      setInterval(() => {
        if (navigator.onLine) {
          this.refreshPrices();
        }
      }, Config.REFRESH_INTERVAL);
    }
  };