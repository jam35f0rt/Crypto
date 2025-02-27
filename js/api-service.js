/**
 * API service for interacting with the Coinbase API
 */
const ApiService = {
    /**
     * Fetch current exchange rates
     * @returns {Object} - Exchange rates
     */
    async fetchExchangeRates() {
      try {
        const response = await axios.get(`${Config.API_BASE_URL}/exchange-rates?currency=USD`);
        return response.data.data.rates;
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        throw new Error('Failed to fetch exchange rates. Please try again.');
      }
    },
    
    /**
     * Fetch historical exchange rates
     * @param {string} date - ISO date string (YYYY-MM-DD)
     * @returns {Object|null} - Historical exchange rates or null if unavailable
     */
    async fetchHistoricalRates(date) {
      try {
        const response = await axios.get(`${Config.API_BASE_URL}/exchange-rates?currency=USD&date=${date}`);
        return response.data.data.rates;
      } catch (error) {
        console.warn('Error fetching historical rates:', error);
        // Return null to indicate fallback should be used
        return null;
      }
    },
    
    /**
     * Generate fallback historical rates when real data is unavailable
     * @param {Object} currentRates - Current exchange rates
     * @returns {Object} - Simulated historical rates
     */
    generateFallbackRates(currentRates) {
      return Object.keys(currentRates).reduce((acc, key) => {
        const currentRate = parseFloat(currentRates[key]);
        // Generate a random change between -5% and +5%
        const randomChange = (Math.random() * 0.1) - 0.05; 
        acc[key] = (currentRate * (1 - randomChange)).toString();
        return acc;
      }, {});
    },
    
    /**
     * Load cryptocurrency list from exchange rates
     * @returns {Array} - List of cryptocurrency objects
     */
    async loadCryptoList() {
      State.set('loading', true);
      
      try {
        const rates = await this.fetchExchangeRates();
        
        // Transform exchange rates into our crypto list format
        const cryptoList = Object.keys(rates)
          .filter(code => code !== 'USD' && !code.includes('USD'))
          .map(code => ({
            id: code,
            name: Utils.getCryptoFullName(code),
            type: 'crypto'
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        State.set('cryptoList', cryptoList);
        State.set('loading', false);
        
        return cryptoList;
      } catch (error) {
        State.set('error', error.message);
        State.set('loading', false);
        throw error;
      }
    },
    
    /**
     * Fetch price data for selected cryptocurrencies
     * @returns {Array} - Updated cryptocurrency objects with price data
     */
    async fetchPriceData() {
      const selectedCryptos = State.get('selectedCryptos');
      if (selectedCryptos.length === 0) return;
      
      State.set('loading', true);
      
      try {
        // Get current exchange rates
        const currentRates = await this.fetchExchangeRates();
        
        // Get historical rates
        const yesterdayDate = Utils.getYesterdayDate();
        let yesterdayRates = await this.fetchHistoricalRates(yesterdayDate);
        
        // Use fallback if historical rates are not available
        if (!yesterdayRates) {
          yesterdayRates = this.generateFallbackRates(currentRates);
        }
        
        // Update each cryptocurrency with new data
        const updatedCryptos = selectedCryptos.map(crypto => {
          try {
            // Calculate price in USD
            if (currentRates[crypto.id]) {
              const rate = parseFloat(currentRates[crypto.id]);
              const price = 1 / rate;
              
              let yesterdayPrice = price;
              let change = 0;
              
              if (yesterdayRates[crypto.id]) {
                const yesterdayRate = parseFloat(yesterdayRates[crypto.id]);
                yesterdayPrice = 1 / yesterdayRate;
                change = ((price - yesterdayPrice) / yesterdayPrice) * 100;
              }
              
              // Generate price history for chart
              const priceHistory = ChartService.generatePriceHistory(price, yesterdayPrice, Config.CHART_POINTS);
              
              return {
                ...crypto,
                price,
                marketPrice: price * 1.005, // Simulate a small buy fee
                change,
                yesterdayPrice,
                priceHistory,
                lastUpdated: new Date().toISOString()
              };
            } else {
              return {
                ...crypto,
                price: null,
                marketPrice: null,
                change: null,
                error: true
              };
            }
          } catch (error) {
            console.error(`Error processing data for ${crypto.id}:`, error);
            return {
              ...crypto,
              price: null,
              marketPrice: null,
              change: null,
              error: true
            };
          }
        });
        
        State.set('selectedCryptos', updatedCryptos);
        State.set('loading', false);
        
        // Save to localStorage
        StorageService.saveToStorage();
        
        return updatedCryptos;
      } catch (error) {
        State.set('error', 'Failed to fetch price data. Please try again.');
        State.set('loading', false);
        throw error;
      }
    }
  };