/**
 * Application configuration settings
 */
const Config = {
    // API settings
    API_BASE_URL: 'https://api.coinbase.com/v2',
    
    // App timing settings
    REFRESH_INTERVAL: 60000, // 60 seconds
    
    // PWA settings
    CACHE_NAME: 'crypto-tracker-v1',
    APP_NAME: 'Cryptocurrency Price Tracker',
    APP_SHORT_NAME: 'Crypto Tracker',
    
    // Chart settings
    CHART_POINTS: 20, // Number of data points for charts
    CHART_COLOR_POSITIVE: '#2ecc71', // Green for positive trends
    CHART_COLOR_NEGATIVE: '#e74c3c', // Red for negative trends
    
    // App version
    VERSION: '1.0.0'
  };