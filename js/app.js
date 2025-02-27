/**
 * Main application entry point
 */
const App = {
    /**
     * Initialize the application
     */
    async init() {
      try {
        console.log(`Initializing Crypto Tracker v${Config.VERSION}`);
        
        // Initialize UI service
        UIService.init();
        
        // Initialize PWA features
        PWAManager.init();
        
        // Load saved data from storage
        StorageService.loadFromStorage();
        
        // Set up search functionality
        this.setupSearch();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load cryptocurrency list
        await ApiService.loadCryptoList();
        
        // Fetch initial price data
        if (State.get('selectedCryptos').length > 0) {
          await ApiService.fetchPriceData();
        }
        
        // Set up auto-refresh
        CryptoManager.setupAutoRefresh();
        
        console.log('Application initialized successfully');
      } catch (error) {
        console.error('Error initializing application:', error);
        State.set('error', 'Failed to initialize application. Please refresh the page and try again.');
      }
    },
    
    /**
     * Set up search functionality
     */
    setupSearch() {
      const cryptoSearch = document.getElementById('crypto-search');
      
      // Create search results container if not exists
      if (!document.getElementById('search-results')) {
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchResults.id = 'search-results';
        cryptoSearch.parentNode.appendChild(searchResults);
      }
      
      const searchResults = document.getElementById('search-results');
      
      // Handle search input with debounce
      cryptoSearch.addEventListener('input', Utils.debounce(function() {
        const searchText = this.value.toLowerCase().trim();
        UIService.updateSearchResults(searchText);
      }, 300));
      
      // Show results on focus
      cryptoSearch.addEventListener('focus', function() {
        const searchText = this.value.toLowerCase().trim();
        UIService.updateSearchResults(searchText);
        searchResults.style.display = 'block';
      });
      
      // Handle click outside to close dropdown
      document.addEventListener('click', function(e) {
        if (!cryptoSearch.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.style.display = 'none';
        }
      });
    },
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Add button
      const addBtn = document.getElementById('add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', CryptoManager.addCrypto);
      }
      
      // Tab buttons
      const tabs = document.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          UIService.switchTab(tab.getAttribute('data-tab'));
        });
      });
      
      // Handle keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Ctrl+F or Command+F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
          e.preventDefault();
          document.getElementById('crypto-search').focus();
        }
        
        // Escape key to close search results
        if (e.key === 'Escape') {
          document.getElementById('search-results').style.display = 'none';
        }
      });
    }
  };
  
  // Initialize the app when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
  