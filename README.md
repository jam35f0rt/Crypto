# Cryptocurrency Price Tracker PWA

A modern Progressive Web App for tracking cryptocurrency prices in real-time.

## Features

- **Real-time price tracking** from Coinbase API
- **Favorites system** to organize your tracked cryptocurrencies
- **Price charts** with visual trend indicators
- **Responsive design** that works on all devices
- **Offline support** with service worker caching
- **PWA features** including installability and home screen icon

## Setup Instructions

1. Clone this repository or download the files
2. Create a file named `sw.js` in the root directory and copy the contents from the service worker code
3. Host the files on a web server (you can use GitHub Pages, Netlify, or any other hosting service)
4. Navigate to the hosted URL in your browser

## File Structure

```
crypto-tracker/
├── index.html                # Main HTML file
├── manifest.json             # PWA manifest
├── sw.js                     # Service Worker
├── css/
│   └── styles.css            # CSS styles
├── js/
│   ├── app.js                # Main application entry point
│   ├── config.js             # Configuration settings
│   ├── utils.js              # Utility functions
│   ├── state.js              # State management
│   ├── storage-service.js    # Local storage service
│   ├── api-service.js        # API interaction
│   ├── chart-service.js      # Chart generation
│   ├── ui-service.js         # UI management
│   ├── crypto-manager.js     # Cryptocurrency management
│   └── pwa-manager.js        # PWA features
└── icons/
    └── icon-512x512.svg      # App icon
```

## Local Development

For local development, you can use a simple HTTP server:

```bash
# If you have Node.js installed
npx http-server

# If you have Python installed
python -m http.server
```

Then navigate to `http://localhost:8080` in your browser.

## Important Note About Service Workers

The service worker will only work in the following scenarios:

1. The site is hosted with HTTPS
2. The site is on localhost (for development)

Service workers will not function on insecure HTTP connections (except for localhost).

## Browser Compatibility

This application works in all modern browsers that support:

- ES6 JavaScript
- Service Workers
- IndexedDB
- SVG

## Credits

- Price data provided by Coinbase API
- Icons created with SVG