'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PaymentOverlay from '@/components/PaymentOverlay';
import PaymentHistory from '@/components/PaymentHistory';
import PaymentDetector from '@/components/PaymentDetector';
import PWAInstaller from '@/components/PWAInstaller';
import { PaymentTransaction } from '@/types/payment';

export default function Home() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<PaymentTransaction | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  // Load payment history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('paymentHistory');
    if (savedHistory) {
      setPaymentHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save payment history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  const handlePaymentDetected = useCallback((payment: PaymentTransaction) => {
    setCurrentPayment(payment);
    setIsOverlayVisible(true);
    
    // Add to payment history
    setPaymentHistory(prev => [payment, ...prev]);
    
    // Send payment detection to service worker for notifications
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PAYMENT_DETECTED',
        payment: payment
      });
    }
    
    // Hide overlay after 5 seconds
    setTimeout(() => {
      setIsOverlayVisible(false);
      setCurrentPayment(null);
    }, 5000);
  }, []);

  const handleTestPayment = useCallback(() => {
    const testPayment: PaymentTransaction = {
      id: Date.now().toString(),
      amount: 25.99,
      currency: 'USD',
      merchant: 'Test Store',
      timestamp: new Date(),
      method: 'Apple Pay',
      status: 'completed'
    };
    
    handlePaymentDetected(testPayment);
  }, [handlePaymentDetected]);

  const clearHistory = useCallback(() => {
    setPaymentHistory([]);
    localStorage.removeItem('paymentHistory');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Tracker
          </h1>
          <p className="text-gray-600">
            Detect and track your mobile payments
          </p>
        </div>

        {/* Payment Detection Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Detection
            </h2>
            <div className={`w-3 h-3 rounded-full ${isDetecting ? 'bg-green-400' : 'bg-gray-300'}`}></div>
          </div>
          
          <PaymentDetector 
            onPaymentDetected={handlePaymentDetected}
            isDetecting={isDetecting}
            setIsDetecting={setIsDetecting}
          />
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleTestPayment}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Test Payment Overlay
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {paymentHistory.length}
              </div>
              <div className="text-sm text-green-600">Total Payments</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                ${paymentHistory.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-blue-600">Total Amount</div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <PaymentHistory 
          payments={paymentHistory}
          onClearHistory={clearHistory}
        />

        {/* PWA Installation */}
        <PWAInstaller />

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">How it works:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Enable payment detection to monitor transactions</li>
            <li>• When you make a payment, an overlay will appear</li>
            <li>• View your payment history and statistics</li>
            <li>• Works with Apple Pay, Google Pay, and other methods</li>
          </ul>
        </div>
      </div>

      {/* Payment Overlay */}
      <PaymentOverlay 
        isVisible={isOverlayVisible}
        payment={currentPayment}
        onClose={() => {
          setIsOverlayVisible(false);
          setCurrentPayment(null);
        }}
      />
    </div>
  );
} 