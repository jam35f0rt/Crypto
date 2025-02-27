# Deployment Instructions

This document explains how to properly deploy the Cryptocurrency Tracker PWA to ensure all features work correctly.

## Required Files

Ensure you have the following files in your project structure:

```
crypto-tracker/
├── index.html                # Main HTML file
├── manifest.json             # PWA manifest
├── sw.js                     # Service Worker
├── css/
│   └── styles.css            # CSS styles
├── js/
│   └── [JavaScript files]    # All JavaScript modules
└── icons/
    └── icon-512x512.svg      # App icon
```

## Deployment Steps

### 1. Prepare the PWA Files

Both the manifest and service worker must be physical files (not generated dynamically):

#### a) Create the manifest.json file

Create a file named `manifest.json` in the root directory with the following content:

```json
{
  "name": "Cryptocurrency Price Tracker",
  "short_name": "Crypto Tracker",
  "description": "Track cryptocurrency prices in real-time with this modern Progressive Web App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ecf0f1",
  "theme_color": "#3498db",
  "icons": [
    {
      "src": "icons/icon-512x512.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

#### b) Create the Service Worker file

Create a file named `sw.js` in the root directory with the content from the provided service worker script.

### 2. Verify Icon Paths

- Make sure your SVG icon is placed in the `icons` directory
- Double-check that the file path in the manifest.json points to the correct location

### 3. Deploy to a Web Server

You have several options for deployment:

#### a) GitHub Pages

1. Create a GitHub repository for your project
2. Push all files to the repository
3. Go to repository Settings > Pages
4. Select the branch to deploy from
5. Your site will be available at `https://yourusername.github.io/repository-name/`

#### b) Netlify

1. Sign up for a Netlify account
2. Create a new site from Git
3. Connect to your GitHub/GitLab repository
4. Deploy

#### c) Vercel

1. Sign up for a Vercel account
2. Import your Git repository
3. Deploy

#### d) Any Web Server

Upload all files to your web server using FTP or your hosting provider's control panel.

### 4. HTTPS Requirement

For the Service Worker to function, your site **must** be served over HTTPS. All the providers mentioned above (GitHub Pages, Netlify, Vercel) automatically serve your site over HTTPS.

### 5. Testing the PWA

After deployment, use Chrome DevTools to verify the PWA is working correctly:

1. Open your deployed site in Chrome
2. Right-click > Inspect
3. Go to the "Application" tab
4. Check:
   - Manifest (should show your app details)
   - Service Workers (should show as registered)
   - Cache Storage (should contain cached files)

### 6. Lighthouse Audit

Run a Lighthouse audit in Chrome DevTools to check your PWA score and get suggestions for improvements:

1. Open Chrome DevTools
2. Go to the "Lighthouse" tab
3. Check "Progressive Web App" category
4. Click "Generate report"

## Troubleshooting

### Service Worker Not Registered

- Check that `sw.js` is at the root of your site
- Ensure your site is served over HTTPS
- Look for JavaScript errors in the Console

### Install Prompt Not Showing

- The app must meet all PWA installability criteria
- Users must interact with the site for a while before the browser triggers the install prompt
- Make sure the manifest is valid

### Icons Not Showing

- Verify the paths in manifest.json
- Make sure the SVG file is accessible and correctly formatted
- Try using PNG fallbacks if SVG doesn't work

## Advanced Configuration

For more advanced caching strategies or offline features, you may want to consider using Workbox, a set of libraries for adding offline support to web apps:

```javascript
// Example of importing Workbox in your service worker
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst()
);
```