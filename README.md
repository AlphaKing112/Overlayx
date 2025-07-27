# Payment Tracker - Mobile Payment Detection & Overlay System

A Progressive Web App (PWA) that detects and displays payment overlays when you make payments through services like Apple Pay, Google Pay, or other mobile payment methods.

## 🚀 Features

### Payment Detection
- **Payment Request API Integration**: Detects payments using the W3C Payment Request API
- **Real-time Monitoring**: Monitors page activity for payment-related interactions
- **Network Request Detection**: Tracks payment-related network requests
- **Multiple Payment Methods**: Supports Apple Pay, Google Pay, credit cards, and more

### Payment Overlay System
- **Bottom Screen Overlay**: Beautiful overlay that slides up from the bottom
- **Payment Details**: Shows amount, merchant, payment method, and transaction status
- **Auto-dismiss**: Automatically hides after 5 seconds
- **Interactive**: Click to view more details or dismiss manually

### Payment History & Analytics
- **Transaction History**: Complete history of detected payments
- **Payment Statistics**: Total transactions, amounts, and trends
- **Local Storage**: Data persists across app sessions
- **Export/Clear**: Manage your payment data

### Progressive Web App (PWA)
- **Installable**: Can be installed on mobile devices like a native app
- **Offline Support**: Works offline with cached data
- **Push Notifications**: Receive notifications for detected payments
- **Service Worker**: Background processing and caching
- **Mobile Optimized**: Responsive design for mobile devices

## 🛠️ Technology Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Payment Request API**: W3C standard for payment processing
- **Service Workers**: Background processing and PWA functionality
- **Web Push API**: Push notifications
- **IndexedDB/LocalStorage**: Client-side data persistence

## 📱 How It Works

### 1. Payment Detection Methods

The app uses multiple techniques to detect payments:

- **Payment Request API**: Direct integration with browser payment APIs
- **DOM Monitoring**: Watches for payment-related UI elements
- **Network Activity**: Monitors payment-related HTTP requests
- **Event Listeners**: Captures payment interactions

### 2. Overlay System

When a payment is detected:
1. Payment data is captured and validated
2. An overlay slides up from the bottom of the screen
3. Payment details are displayed with proper formatting
4. The overlay auto-dismisses or can be manually closed
5. Transaction is saved to history

### 3. Notification System

- Service worker receives payment detection events
- Push notifications can be sent (with user permission)
- Background sync ensures data consistency
- Offline capability maintains functionality

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser with Payment Request API support

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd payment-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
Visit `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## 📱 Mobile Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the share button
3. Select "Add to Home Screen"
4. The app will install like a native app

### Android (Chrome)
1. Open the app in Chrome
2. Look for the "Install" prompt or
3. Tap the three dots menu → "Add to Home screen"

## 🔧 Configuration

### Payment Method Setup

The app automatically detects supported payment methods but you can configure:

```typescript
// src/types/payment.ts
export interface PaymentMethodData {
  supportedMethods: string;
  data?: Record<string, unknown>;
}
```

### Notification Settings

Configure push notifications in the service worker:

```javascript
// public/sw.js
self.addEventListener('push', (event) => {
  // Customize notification behavior
});
```

## 🧪 Testing

### Test Payment Overlay
1. Open the app
2. Click "Test Payment Overlay"
3. A sample payment overlay will appear

### Test Payment Request API
1. Enable payment detection
2. Click "Test Payment" (if supported)
3. A real Payment Request dialog will appear

### Test PWA Features
1. Install the app on your device
2. Test offline functionality
3. Try push notifications

## 🔐 Privacy & Security

- **No Server Storage**: All data stored locally on device
- **No Payment Processing**: App only detects and displays payment info
- **No Sensitive Data**: Only captures transaction metadata
- **User Consent**: Notifications require explicit permission

## 🌟 Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Payment Request API | ✅ | ✅ | ❌ | ✅ |
| Service Workers | ✅ | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ✅ | ✅ | ✅ |
| PWA Installation | ✅ | ✅ | ❌ | ✅ |

## 🚧 Limitations

- **Payment Request API**: Limited browser support (mainly WebKit/Chromium)
- **iOS Restrictions**: Some PWA features limited on iOS
- **Payment Detection**: Cannot detect all payment types
- **Real Payments**: For demo/testing purposes only

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with PWA meta tags
│   └── page.tsx          # Main application page
├── components/            # React components
│   ├── PaymentDetector.tsx   # Payment detection logic
│   ├── PaymentOverlay.tsx    # Payment overlay UI
│   ├── PaymentHistory.tsx    # Transaction history
│   └── PWAInstaller.tsx      # PWA installation helper
├── types/                 # TypeScript type definitions
│   └── payment.ts        # Payment-related types
└── styles/               # CSS and styling
    └── globals.css      # Global styles

public/
├── manifest.json         # PWA manifest
├── sw.js                # Service worker
└── icons/               # PWA icons
```

## 🔮 Future Enhancements

- **Backend Integration**: Server-side payment tracking
- **Advanced Analytics**: Detailed spending insights
- **Category Detection**: Automatic payment categorization
- **Export Features**: CSV/PDF export of transaction data
- **Widgets**: Home screen widgets for quick stats
- **Integrations**: Bank account/credit card integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for demonstration and educational purposes only. It does not process real payments or handle sensitive financial data. Always follow proper security practices when dealing with payment information.

---

**Built with ❤️ for the mobile payment detection community**