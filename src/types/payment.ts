export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  merchant: string;
  timestamp: Date;
  method: 'Apple Pay' | 'Google Pay' | 'Credit Card' | 'Bank Transfer' | 'Other';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  category?: string;
  icon?: string;
}

export interface PaymentDetectorConfig {
  enableNotifications: boolean;
  enableBackgroundDetection: boolean;
  enablePaymentRequestAPI: boolean;
  enableWebPayments: boolean;
  autoHideDelay: number;
}

export interface PaymentOverlayConfig {
  position: 'top' | 'bottom' | 'center';
  animationType: 'slide' | 'fade' | 'bounce';
  duration: number;
  showAmount: boolean;
  showMerchant: boolean;
  showMethod: boolean;
  backgroundColor: string;
  textColor: string;
}

export interface PaymentStats {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  mostUsedMethod: string;
  dailyAverage: number;
  monthlyTotal: number;
}

// Payment Request API types for better TypeScript support
export interface PaymentMethodData {
  supportedMethods: string;
  data?: Record<string, unknown>;
}

export interface PaymentDetailsInit {
  total: PaymentItem;
  displayItems?: PaymentItem[];
  shippingOptions?: PaymentShippingOption[];
  modifiers?: PaymentDetailsModifier[];
  id?: string;
}

export interface PaymentItem {
  label: string;
  amount: PaymentCurrencyAmount;
  pending?: boolean;
}

export interface PaymentCurrencyAmount {
  currency: string;
  value: string;
}

export interface PaymentShippingOption {
  id: string;
  label: string;
  amount: PaymentCurrencyAmount;
  selected?: boolean;
}

export interface PaymentDetailsModifier {
  supportedMethods: string;
  total?: PaymentItem;
  additionalDisplayItems?: PaymentItem[];
  data?: Record<string, unknown>;
}

export interface PaymentOptions {
  requestPayerName?: boolean;
  requestPayerEmail?: boolean;
  requestPayerPhone?: boolean;
  requestShipping?: boolean;
  shippingType?: 'shipping' | 'delivery' | 'pickup';
}

// Extend the global Window interface for Payment Request API
declare global {
  interface Window {
    PaymentRequest?: typeof PaymentRequest;
  }
}