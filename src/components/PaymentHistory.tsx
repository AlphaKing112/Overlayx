'use client';

import React, { useState } from 'react';
import { PaymentTransaction } from '@/types/payment';

interface PaymentHistoryProps {
  payments: PaymentTransaction[];
  onClearHistory: () => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments, onClearHistory }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
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
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      case 'cancelled':
        return 'text-gray-600';
      default:
        return 'text-blue-600';
    }
  };

  const visiblePayments = isExpanded ? payments : payments.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
        {payments.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
          <p className="text-gray-600">Your payment history will appear here</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visiblePayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSelectedPayment(payment)}
              >
                <div className="flex-shrink-0 text-2xl mr-3">
                  {getMethodIcon(payment.method)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {payment.merchant}
                    </h3>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatAmount(payment.amount, payment.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-600">
                      {formatDate(payment.timestamp)} • {formatTime(payment.timestamp)}
                    </p>
                    <span className={`text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {payments.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
            >
              {isExpanded ? 'Show Less' : `Show ${payments.length - 3} More`}
            </button>
          )}
        </>
      )}

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{getMethodIcon(selectedPayment.method)}</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatAmount(selectedPayment.amount, selectedPayment.currency)}
                </div>
                <div className="text-sm text-gray-600">{selectedPayment.merchant}</div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium">{selectedPayment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {new Date(selectedPayment.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{formatTime(selectedPayment.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">{selectedPayment.id}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;