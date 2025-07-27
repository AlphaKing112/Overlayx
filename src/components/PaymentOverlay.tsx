'use client';

import React, { useEffect, useState } from 'react';
import { PaymentTransaction } from '@/types/payment';

interface PaymentOverlayProps {
  isVisible: boolean;
  payment: PaymentTransaction | null;
  onClose: () => void;
}

const PaymentOverlay: React.FC<PaymentOverlayProps> = ({ isVisible, payment, onClose }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isVisible) {
      setAnimationClass('animate-slide-up');
    } else {
      setAnimationClass('animate-slide-down');
    }
  }, [isVisible]);

  if (!payment) return null;

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Apple Pay':
        return '📱';
      case 'Google Pay':
        return '💳';
      case 'Credit Card':
        return '💳';
      case 'Bank Transfer':
        return '🏦';
      default:
        return '💰';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isVisible ? 'bg-opacity-20' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Overlay */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-white shadow-2xl border-t border-gray-200
          transition-transform duration-300 ease-out
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 animate-progress"></div>

        <div className="p-6 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h2 className="text-lg font-semibold text-gray-900">Payment Detected</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            {/* Amount and Status */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatAmount(payment.amount, payment.currency)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatTime(payment.timestamp)}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </div>
            </div>

            {/* Merchant and Method */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-medium text-gray-900">{payment.merchant}</div>
                  {payment.description && (
                    <div className="text-sm text-gray-600">{payment.description}</div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getMethodIcon(payment.method)}</span>
                  <span className="text-sm font-medium text-gray-700">{payment.method}</span>
                </div>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-mono text-gray-700">{payment.id.slice(-8)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              View Details
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-progress {
          animation: progress 5s linear;
        }
      `}</style>
    </>
  );
};

export default PaymentOverlay;