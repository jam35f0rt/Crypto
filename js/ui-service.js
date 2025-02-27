/**
 * UI service for managing the user interface
 */
const UIService = {
    /**
     * Initialize UI components and listeners
     */
    init() {
      // Set up state change listeners
      State.addListener('loading', this.renderLoading.bind(this));
      State.addListener('selectedCryptos', this.renderCryptos.bind(this));
      State.addListener('favorites', this.renderFavorites.bind(this));
      State.addListener('error', this.renderError.bind(this));
    },
    
    /**
     * Show or hide loading indicator
     * @param {boolean} isLoading - Loading state
     */
    renderLoading(isLoading) {
      const loader = document.getElementById('loader');
      if (isLoading) {
        loader.style.display = 'flex';
      } else {
        loader.style.display = 'none';
      }
    },
    
    /**
     * Render error message
     * @param {string|null} error - Error message or null to clear
     */
    renderError(error) {
      const errorContainer = document.getElementById('error-container');
      
      if (error) {
        errorContainer.innerHTML = `
          <div class="error-message">
            ${error}
          </div>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          errorContainer.innerHTML = '';
          State.set('error', null);
        }, 5000);
      } else {
        errorContainer.innerHTML = '';
      }
    },
    
    /**
     * Switch between tabs
     * @param {string} tab - Tab ID ('all' or 'favorites')
     */
    switchTab(tab) {
      State.set('activeTab', tab);
      
      const tabs = document.querySelectorAll('.tab');
      const tabContents = document.querySelectorAll('.tab-content');
      
      tabs.forEach(tabEl => {
        if (tabEl.getAttribute('data-tab') === tab) {
          tabEl.classList.add('active');
        } else {
          tabEl.classList.remove('active');
        }
      });
      
      tabContents.forEach(content => {
        if (content.id === `tab-${tab}`) {
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      });
    },
    
    /**
     * Update search results dropdown
     * @param {string} searchText - Search text
     */
    updateSearchResults(searchText) {
      const searchResults = document.getElementById('search-results');
      searchResults.innerHTML = '';
      
      // Filter available cryptos
      const availableCryptos = State.get('cryptoList').filter(crypto => 
        !State.get('selectedCryptos').some(selected => selected.id === crypto.id)
      );
      
      if (availableCryptos.length === 0) {
        searchResults.innerHTML = '<div class="crypto-option">No cryptocurrencies available</div>';
        searchResults.style.display = 'block';
        return;
      }
      
      // Filter based on search text
      let filteredCryptos = availableCryptos;
      if (searchText) {
        filteredCryptos = availableCryptos.filter(crypto => 
          crypto.name.toLowerCase().includes(searchText) || 
          crypto.id.toLowerCase().includes(searchText)
        );
      }
      
      // Limit to first 50 results to keep dropdown manageable
      filteredCryptos = filteredCryptos.slice(0, 50);
      
      if (filteredCryptos.length === 0) {
        searchResults.innerHTML = '<div class="crypto-option">No matches found</div>';
      } else {
        filteredCryptos.forEach(crypto => {
          const option = document.createElement('div');
          option.className = 'crypto-option';
          option.setAttribute('data-id', crypto.id);
          option.textContent = `${crypto.name} (${crypto.id})`;
          
          option.addEventListener('click', function() {
            const cryptoSearch = document.getElementById('crypto-search');
            cryptoSearch.value = this.textContent;
            cryptoSearch.setAttribute('data-selected', this.getAttribute('data-id'));
            searchResults.style.display = 'none';
          });
          
          searchResults.appendChild(option);
        });
      }
      
      searchResults.style.display = 'block';
    },
    
    /**
     * Render cryptocurrencies in the main container
     * @param {Array} selectedCryptos - Selected cryptocurrencies array
     */
    renderCryptos(selectedCryptos) {
      const cryptoContainer = document.getElementById('crypto-container');
      cryptoContainer.innerHTML = '';
      
      if (!selectedCryptos || selectedCryptos.length === 0) {
        cryptoContainer.innerHTML = `
          <div class="empty-state">
            <h3>No cryptocurrencies added yet</h3>
            <p>Use the search box above to add cryptocurrencies to track</p>
          </div>
        `;
        return;
      }
      
      selectedCryptos.forEach(crypto => {
        const isFavorite = State.get('favorites').includes(crypto.id);
        cryptoContainer.appendChild(this.createCryptoCard(crypto, isFavorite));
      });
      
      // Add event listeners to the buttons
      this.addCardEventListeners();
    },
    
    /**
     * Render favorite cryptocurrencies
     * @param {Array} favorites - Favorite cryptocurrency IDs
     */
    renderFavorites(favorites = []) {
      const favoritesContainer = document.getElementById('favorites-container');
      if (!favoritesContainer) return; // Safety check
      
      favoritesContainer.innerHTML = '';
      
      const favoriteCryptos = State.get('selectedCryptos').filter(crypto => 
        favorites.includes(crypto.id)
      );
      
      if (favoriteCryptos.length === 0) {
        favoritesContainer.innerHTML = `
          <div class="empty-state">
            <h3>No favorites yet</h3>
            <p>Mark cryptocurrencies as favorites to see them here</p>
          </div>
        `;
        return;
      }
      
      favoriteCryptos.forEach(crypto => {
        favoritesContainer.appendChild(this.createCryptoCard(crypto, true));
      });
      
      // Add event listeners to the buttons
      this.addCardEventListeners();
    },
    
    /**
     * Create a cryptocurrency card element
     * @param {Object} crypto - Cryptocurrency object
     * @param {boolean} isFavorite - Whether the crypto is favorited
     * @returns {HTMLElement} - Card element
     */
    createCryptoCard(crypto, isFavorite) {
      const cryptoCard = document.createElement('div');
      cryptoCard.className = 'crypto-card';
      
      // Format price with appropriate decimal places
      const priceDisplay = Utils.formatPrice(crypto.price);
      
      // Format change percentage
      let changeElement = '';
      if (crypto.change !== null) {
        const changeClass = crypto.change >= 0 ? 'positive' : 'negative';
        const changeSign = crypto.change >= 0 ? '+' : '';
        changeElement = `
          <span class="crypto-change ${changeClass}">
            ${changeSign}${crypto.change.toFixed(2)}%
          </span>
        `;
      }
      
      cryptoCard.innerHTML = `
        <div class="crypto-info-container">
          <div class="crypto-info">
            <div class="crypto-header">
              <div class="crypto-icon">${crypto.id.charAt(0)}</div>
              <div class="crypto-name">
                <h3>${crypto.name}</h3>
                <p>${crypto.id}</p>
              </div>
            </div>
            <div class="crypto-price">${priceDisplay}</div>
            ${changeElement}
          </div>
          <div class="crypto-chart">
            <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
              <path d="${ChartService.generateChartPath(crypto)}" fill="none" stroke="${ChartService.getChartColor(crypto.change)}" stroke-width="2" />
            </svg>
          </div>
        </div>
        <div class="action-buttons">
          <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${crypto.id}">
            ${isFavorite ? '★ Favorited' : '☆ Favorite'}
          </button>
          <button class="remove-btn" data-id="${crypto.id}">Remove</button>
        </div>
      `;
      
      return cryptoCard;
    },
    
    /**
     * Add event listeners to crypto card buttons
     */
    addCardEventListeners() {
      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.getAttribute('data-id');
          CryptoManager.removeCrypto(id);
          e.stopPropagation(); // Prevent event bubbling
        });
      });
      
      document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.getAttribute('data-id');
          CryptoManager.toggleFavorite(id);
          e.stopPropagation(); // Prevent event bubbling
        });
      });
    }
  };