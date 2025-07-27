'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { PaymentTransaction, PaymentMethodData, PaymentDetailsInit, PaymentOptions } from '@/types/payment';

interface PaymentDetectorProps {
  onPaymentDetected: (payment: PaymentTransaction) => void;
  isDetecting: boolean;
  setIsDetecting: (detecting: boolean) => void;
}

const PaymentDetector: React.FC<PaymentDetectorProps> = ({ 
  onPaymentDetected, 
  isDetecting, 
  setIsDetecting 
}) => {
  const [supportedMethods, setSupportedMethods] = useState<string[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support for Payment Request API
  useEffect(() => {
    const checkSupport = async () => {
      if (!window.PaymentRequest) {
        console.log('Payment Request API not supported');
        setIsSupported(false);
        return;
      }

      setIsSupported(true);
      
      // Test which payment methods are supported
      const testMethods = [
        'https://apple.com/apple-pay',
        'https://google.com/pay',
        'basic-card'
      ];

      const supported: string[] = [];

      for (const method of testMethods) {
        try {
          const methodData: PaymentMethodData[] = [{
            supportedMethods: method,
            data: method === 'https://apple.com/apple-pay' ? {
              version: 3,
              merchantIdentifier: 'merchant.example.com',
              merchantCapabilities: ['supports3DS'],
              supportedNetworks: ['visa', 'masterCard', 'amex'],
              countryCode: 'US'
            } : method === 'https://google.com/pay' ? {
              environment: 'TEST',
              apiVersion: 2,
              apiVersionMinor: 0,
              merchantInfo: {
                merchantName: 'Payment Tracker'
              },
              allowedPaymentMethods: [{
                type: 'CARD',
                parameters: {
                  allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                  allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX']
                }
              }]
            } : {}
          }];

          const details: PaymentDetailsInit = {
            total: {
              label: 'Test',
              amount: { currency: 'USD', value: '0.01' }
            }
          };

          const request = new PaymentRequest(methodData, details);
          const canMake = await request.canMakePayment();
          
          if (canMake) {
            supported.push(method);
          }
        } catch (error) {
          console.log(`Method ${method} not supported:`, error);
        }
      }

      setSupportedMethods(supported);
    };

    checkSupport();
  }, []);

  // Monitor for payment-related page activity
  const detectPaymentActivity = useCallback(() => {
    // Look for payment-related elements that might indicate a transaction
    const paymentIndicators = [
      'apple-pay-button',
      '[data-payment]',
      '.payment-button',
      '.pay-button',
      '#apple-pay',
      '#google-pay',
      '[role="button"][aria-label*="pay"]',
      'button[class*="pay"]',
      'button[class*="payment"]',
      '.checkout-button',
      '.buy-button'
    ];

    let hasPaymentElements = false;
    for (const selector of paymentIndicators) {
      if (document.querySelector(selector)) {
        hasPaymentElements = true;
        break;
      }
    }

    // Monitor for payment-related network requests
    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest.prototype.open;

    // Wrap fetch to detect payment requests
    window.fetch = async (...args) => {
      const url = args[0]?.toString() || '';
      const isPaymentRequest = url.includes('pay') || 
                              url.includes('payment') || 
                              url.includes('transaction') ||
                              url.includes('checkout');
      
      if (isPaymentRequest && isDetecting) {
        console.log('Payment-related network request detected:', url);
        setLastActivity(new Date());
        
        // Simulate payment detection after network activity
        setTimeout(() => {
          const simulatedPayment: PaymentTransaction = {
            id: Date.now().toString(),
            amount: Math.random() * 100 + 10,
            currency: 'USD',
            merchant: extractMerchantFromURL(url),
            timestamp: new Date(),
            method: 'Other',
            status: 'completed',
            description: 'Network activity detected'
          };
          onPaymentDetected(simulatedPayment);
        }, 1000);
      }

      return originalFetch.apply(window, args);
    };

    // Monitor for specific payment events
    const handlePaymentEvent = (event: Event) => {
      if (!isDetecting) return;
      
      const target = event.target as HTMLElement;
      const isPaymentElement = target.matches('apple-pay-button') ||
                              target.closest('[data-payment]') ||
                              target.closest('.payment-button') ||
                              target.textContent?.toLowerCase().includes('pay');

      if (isPaymentElement) {
        console.log('Payment element interaction detected');
        setLastActivity(new Date());
        
        // Simulate payment after element interaction
        setTimeout(() => {
          const simulatedPayment: PaymentTransaction = {
            id: Date.now().toString(),
            amount: Math.random() * 100 + 5,
            currency: 'USD',
            merchant: document.title || 'Unknown Merchant',
            timestamp: new Date(),
            method: getPaymentMethodFromElement(target),
            status: 'completed',
            description: 'UI interaction detected'
          };
          onPaymentDetected(simulatedPayment);
        }, 500);
      }
    };

    // Add event listeners for payment interactions
    document.addEventListener('click', handlePaymentEvent, true);
    document.addEventListener('touchstart', handlePaymentEvent, true);

    return () => {
      window.fetch = originalFetch;
      document.removeEventListener('click', handlePaymentEvent, true);
      document.removeEventListener('touchstart', handlePaymentEvent, true);
    };
  }, [isDetecting, onPaymentDetected]);

  // Start/stop detection
  useEffect(() => {
    if (isDetecting) {
      console.log('Starting payment detection...');
      const cleanup = detectPaymentActivity();

      // Set up periodic checking
      detectionIntervalRef.current = setInterval(() => {
        setLastActivity(new Date());
      }, 5000);

      return () => {
        cleanup?.();
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }
      };
    } else {
      console.log('Stopping payment detection...');
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    }
  }, [isDetecting, detectPaymentActivity]);

  // Test Payment Request API
  const testPaymentRequest = useCallback(async () => {
    if (!window.PaymentRequest || supportedMethods.length === 0) {
      alert('Payment Request API not supported or no payment methods available');
      return;
    }

    try {
      const methodData: PaymentMethodData[] = supportedMethods.map(method => ({
        supportedMethods: method,
        data: method === 'https://apple.com/apple-pay' ? {
          version: 3,
          merchantIdentifier: 'merchant.example.com',
          merchantCapabilities: ['supports3DS'],
          supportedNetworks: ['visa', 'masterCard', 'amex'],
          countryCode: 'US'
        } : method === 'https://google.com/pay' ? {
          environment: 'TEST',
          apiVersion: 2,
          apiVersionMinor: 0,
          merchantInfo: {
            merchantName: 'Payment Tracker Test'
          },
          allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX']
            }
          }]
        } : {}
      }));

      const details: PaymentDetailsInit = {
        total: {
          label: 'Test Payment',
          amount: { currency: 'USD', value: '1.00' }
        },
        displayItems: [{
          label: 'Test Item',
          amount: { currency: 'USD', value: '1.00' }
        }]
      };

      const options: PaymentOptions = {
        requestPayerName: true,
        requestPayerEmail: false,
        requestPayerPhone: false
      };

      const request = new PaymentRequest(methodData, details, options);
      
      const response = await request.show();
      
      // Process the payment (this would be where you'd send to your payment processor)
      console.log('Payment response:', response);
      
      // Create a payment transaction from the response
      const payment: PaymentTransaction = {
        id: Date.now().toString(),
        amount: 1.00,
        currency: 'USD',
        merchant: 'Payment Tracker Test',
        timestamp: new Date(),
        method: getPaymentMethodFromResponse(response.methodName),
        status: 'completed',
        description: 'Payment Request API test'
      };

      await response.complete('success');
      onPaymentDetected(payment);
      
    } catch (error) {
      console.log('Payment request cancelled or failed:', error);
    }
  }, [supportedMethods, onPaymentDetected]);

  // Helper functions
  const extractMerchantFromURL = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'Unknown Merchant';
    }
  };

  const getPaymentMethodFromElement = (element: HTMLElement): PaymentTransaction['method'] => {
    const text = element.textContent?.toLowerCase() || '';
    const className = element.className.toLowerCase();
    
    if (text.includes('apple') || className.includes('apple')) return 'Apple Pay';
    if (text.includes('google') || className.includes('google')) return 'Google Pay';
    if (text.includes('card') || className.includes('card')) return 'Credit Card';
    return 'Other';
  };

  const getPaymentMethodFromResponse = (methodName: string): PaymentTransaction['method'] => {
    if (methodName.includes('apple-pay')) return 'Apple Pay';
    if (methodName.includes('google.com/pay')) return 'Google Pay';
    if (methodName.includes('basic-card')) return 'Credit Card';
    return 'Other';
  };

  return (
    <div className="space-y-4">
      {/* Support Status */}
      <div className={`p-3 rounded-lg ${isSupported ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isSupported ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm font-medium">
            {isSupported ? 'Payment Request API Supported' : 'Payment Request API Not Supported'}
          </span>
        </div>
        {supportedMethods.length > 0 && (
          <div className="mt-2 text-sm">
            Supported methods: {supportedMethods.map(method => {
              if (method.includes('apple-pay')) return 'Apple Pay';
              if (method.includes('google.com/pay')) return 'Google Pay';
              if (method === 'basic-card') return 'Credit Cards';
              return method;
            }).join(', ')}
          </div>
        )}
      </div>

      {/* Detection Controls */}
      <div className="flex space-x-3">
        <button
          onClick={() => setIsDetecting(!isDetecting)}
          className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors ${
            isDetecting
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isDetecting ? 'Stop Detection' : 'Start Detection'}
        </button>

        {isSupported && supportedMethods.length > 0 && (
          <button
            onClick={testPaymentRequest}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Test Payment
          </button>
        )}
      </div>

      {/* Detection Status */}
      {isDetecting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">Detection Active</span>
          </div>
          <div className="mt-1 text-xs text-blue-600">
            Monitoring for payment activity...
          </div>
          <div className="mt-1 text-xs text-blue-600">
            Last activity: {lastActivity.toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetector;