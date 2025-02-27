/**
 * Progressive Web App manager
 */
const PWAManager = {
  /**
   * Initialize PWA features
   */
  init() {
    this.createManifest();
    this.setupServiceWorker();
    this.setupInstallPrompt();
    this.setupOfflineDetection();
  },
  
  /**
   * Create manifest.json programmatically
   */
  createManifest() {
    try {
      const appIcon = document.getElementById('app-icons')?.content.querySelector('#app-icon');
      
      if (!appIcon) {
        console.error('App icon SVG not found in template');
        return;
      }
      
      const manifestData = {
        "name": Config.APP_NAME,
        "short_name": Config.APP_SHORT_NAME,
        "description": "Track cryptocurrency prices in real-time",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ecf0f1",
        "theme_color": "#3498db",
        "icons": [
          {
            "src": "data:image/svg+xml;base64," + btoa(appIcon.outerHTML),
            "sizes": "any",
            "type": "image/svg+xml",
            "purpose": "any"
          }
        ]
      };
      
      const blob = new Blob([JSON.stringify(manifestData)], {type: 'application/json'});
      const manifestURL = URL.createObjectURL(blob);
      
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        manifestLink.href = manifestURL;
      }
      
      console.log('Manifest created');
    } catch (error) {
      console.error('Error creating manifest:', error);
    }
  },
  
  /**
   * Setup service worker
   */
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Using a standard file path instead of a blob URL
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    } else {
      console.log('Service workers are not supported by this browser');
    }
  },
  
  /**
   * Setup install prompt
   */
  setupInstallPrompt() {
    const installPrompt = document.getElementById('install-prompt');
    const installBtn = document.getElementById('install-btn');
    
    // Capture the deferredPrompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      
      // Save the event so it can be triggered later
      State.set('deferredPrompt', e);
      
      // Show the install button
      installPrompt.style.display = 'flex';
    });
    
    // Handle the install button click
    if (installBtn) {
      installBtn.addEventListener('click', () => {
        const deferredPrompt = State.get('deferredPrompt');
        
        if (deferredPrompt) {
          // Show the install prompt
          deferredPrompt.prompt();
          
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
            } else {
              console.log('User dismissed the install prompt');
            }
            
            // Clear the deferredPrompt
            State.set('deferredPrompt', null);
            
            // Hide the install button
            installPrompt.style.display = 'none';
          });
        }
      });
    }
    
    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      // Hide the install button
      installPrompt.style.display = 'none';
      console.log('PWA was installed');
    });
  },
  
  /**
   * Setup offline detection
   */
  setupOfflineDetection() {
    const offlineBanner = document.getElementById('offline-banner');
    
    // Check initial state
    if (!navigator.onLine) {
      State.set('isOnline', false);
      if (offlineBanner) {
        offlineBanner.style.display = 'block';
      }
    }
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      State.set('isOnline', true);
      
      if (offlineBanner) {
        offlineBanner.style.display = 'none';
      }
      
      // Refresh data when coming back online
      CryptoManager.refreshPrices();
    });
    
    window.addEventListener('offline', () => {
      State.set('isOnline', false);
      
      if (offlineBanner) {
        offlineBanner.style.display = 'block';
      }
    });
  }
};