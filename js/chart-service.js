/**
 * Chart generation service
 */
const ChartService = {
    /**
     * Generate simulated price history for charts
     * @param {number} currentPrice - Current price
     * @param {number} yesterdayPrice - Yesterday's price
     * @param {number} points - Number of data points to generate
     * @returns {Array} - Array of price history objects
     */
    generatePriceHistory(currentPrice, yesterdayPrice, points) {
      const history = [];
      const trend = currentPrice >= yesterdayPrice ? 1 : -1;
      const priceDiff = Math.abs(currentPrice - yesterdayPrice);
      
      // Start with yesterday's price
      let lastPrice = yesterdayPrice;
      
      for (let i = 0; i < points; i++) {
        // Calculate progress (0 to 1) from yesterday to today
        const progress = i / (points - 1);
        
        // Base value follows the trend from yesterday to today
        const baseValue = yesterdayPrice + (progress * priceDiff * trend);
        
        // Add some randomness but preserve the general trend
        const volatility = 0.02; // 2% max deviation from trend line
        const randomFactor = 1 + ((Math.random() * volatility * 2) - volatility);
        
        const price = baseValue * randomFactor;
        
        // Don't let random spikes overcome the overall trend
        if ((trend > 0 && price < lastPrice) || (trend < 0 && price > lastPrice)) {
          lastPrice = price * 0.9998 + lastPrice * 0.0002; // Small smoothing
        } else {
          lastPrice = price;
        }
        
        // Timestamp for the datapoint (from yesterday to now)
        const timestamp = Date.now() - (24 * 60 * 60 * 1000) + (progress * 24 * 60 * 60 * 1000);
        
        history.push({
          timestamp,
          price: lastPrice
        });
      }
      
      // Make sure the last point matches the current price exactly
      if (history.length > 0) {
        history[history.length - 1].price = currentPrice;
      }
      
      return history;
    },
    
    /**
     * Generate SVG path from crypto data
     * @param {Object} crypto - Cryptocurrency object
     * @returns {string} - SVG path data string
     */
    generateChartPath(crypto) {
      // If we have history data, use it
      if (crypto.priceHistory && crypto.priceHistory.length > 0) {
        return this.generatePathFromHistory(crypto.priceHistory);
      }
      
      // Otherwise generate a random path that somewhat follows the trend
      const trend = crypto.change >= 0 ? 1 : -1;
      let path = 'M0,35';
      const points = 10;
      
      for (let i = 1; i <= points; i++) {
        const x = (i / points) * 100;
        
        // Start around middle
        let y = 25;
        
        // Add randomness but follow the general trend
        const randomVariation = Math.random() * 20 - 10; // -10 to +10
        const trendComponent = trend * (Math.random() * 15) * (i / points);
        
        y = y - trendComponent + randomVariation;
        // Keep within svg boundaries
        y = Math.max(5, Math.min(45, y));
        
        path += ` L${x},${y}`;
      }
      
      return path;
    },
    
    /**
     * Generate path from actual price history data
     * @param {Array} history - Price history array
     * @returns {string} - SVG path data string
     */
    generatePathFromHistory(history) {
      if (!history || history.length < 2) {
        return 'M0,25 L100,25'; // Flat line if no history
      }
      
      // Find min and max for scaling
      const prices = history.map(h => h.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const range = max - min || 1; // Avoid division by zero
      
      // Generate the path
      let path = `M0,${this.scaleY(history[0].price, min, range)}`;
      
      for (let i = 1; i < history.length; i++) {
        const x = (i / (history.length - 1)) * 100;
        const y = this.scaleY(history[i].price, min, range);
        path += ` L${x},${y}`;
      }
      
      return path;
    },
    
    /**
     * Helper to scale Y values to fit in the SVG
     * @param {number} price - Price value
     * @param {number} min - Minimum price in dataset
     * @param {number} range - Price range in dataset
     * @returns {number} - Scaled Y value
     */
    scaleY(price, min, range) {
      // Scale to 5-45 range (inverted since SVG y-axis is top-down)
      return 45 - ((price - min) / range) * 40;
    },
    
    /**
     * Get chart color based on price trend
     * @param {number} change - Price change percentage
     * @returns {string} - Color hex code
     */
    getChartColor(change) {
      return change >= 0 ? Config.CHART_COLOR_POSITIVE : Config.CHART_COLOR_NEGATIVE;
    }
  };