const CACHE_NAME = 'payment-tracker-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  // Add other static assets as needed
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Payment detection events
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PAYMENT_DETECTED') {
    // Handle payment detection from main thread
    console.log('Payment detected in service worker:', event.data.payment);
    
    // You could store the payment locally, send notifications, etc.
    if ('serviceWorker' in navigator && 'Notification' in window) {
      self.registration.showNotification('Payment Detected', {
        body: `${event.data.payment.merchant} - ${event.data.payment.amount} ${event.data.payment.currency}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'payment-' + event.data.payment.id,
        requireInteraction: false,
        silent: false,
        data: event.data.payment
      });
    }
  }
});

// Background sync for offline payment tracking
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-payment-sync') {
    event.waitUntil(syncPayments());
  }
});

async function syncPayments() {
  // Sync any pending payments when back online
  console.log('Syncing payments in background');
  // Implementation would depend on your backend
}

// Push notifications for payment alerts
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New payment activity detected',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Payment Tracker', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app to payment details
    event.waitUntil(
      clients.openWindow('/?payment=' + event.notification.data?.id)
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Payment app handling (for Web Payments API integration)
self.addEventListener('canmakepayment', (event) => {
  event.respondWith(true);
});

self.addEventListener('paymentrequest', (event) => {
  // Handle payment requests if this app acts as a payment handler
  event.respondWith(
    new Promise((resolve, reject) => {
      // Open payment handler window
      const url = '/payment-handler?total=' + 
                  event.total.amount.value + 
                  '&currency=' + event.total.amount.currency;
      
      resolve(clients.openWindow(url));
    })
  );
});

console.log('Payment Tracker Service Worker loaded');