
export interface PayPalSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  billing_cycles: BillingCycle[];
  payment_preferences: PaymentPreferences;
  taxes?: TaxInfo;
}

export interface BillingCycle {
  frequency: {
    interval_unit: 'MONTH' | 'YEAR' | 'WEEK' | 'DAY';
    interval_count: number;
  };
  tenure_type: 'REGULAR' | 'TRIAL';
  sequence: number;
  total_cycles: number;
  pricing_scheme: {
    fixed_price: {
      value: string;
      currency_code: string;
    };
  };
}

export interface PaymentPreferences {
  auto_bill_outstanding: boolean;
  setup_fee?: {
    value: string;
    currency_code: string;
  };
  setup_fee_failure_action: 'CONTINUE' | 'CANCEL';
  payment_failure_threshold: number;
}

export interface TaxInfo {
  percentage: string;
  inclusive: boolean;
}

export interface PayPalSubscription {
  id: string;
  plan_id: string;
  status: 'APPROVAL_PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  subscriber: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
  };
  billing_info: {
    outstanding_balance: {
      currency_code: string;
      value: string;
    };
    cycle_executions: Array<{
      tenure_type: string;
      sequence: number;
      cycles_completed: number;
      cycles_remaining: number;
    }>;
    last_payment?: {
      amount: {
        currency_code: string;
        value: string;
      };
      time: string;
    };
    next_billing_time?: string;
  };
  create_time: string;
  update_time: string;
}

export interface PayPalPayment {
  id: string;
  intent: 'CAPTURE' | 'AUTHORIZE';
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  purchase_units: Array<{
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
      breakdown?: {
        item_total?: {
          currency_code: string;
          value: string;
        };
        shipping?: {
          currency_code: string;
          value: string;
        };
        handling?: {
          currency_code: string;
          value: string;
        };
        tax_total?: {
          currency_code: string;
          value: string;
        };
        insurance?: {
          currency_code: string;
          value: string;
        };
        shipping_discount?: {
          currency_code: string;
          value: string;
        };
        discount?: {
          currency_code: string;
          value: string;
        };
      };
    };
    payee?: {
      email_address: string;
      merchant_id: string;
    };
    description?: string;
    custom_id?: string;
    invoice_id?: string;
    items?: Array<{
      name: string;
      unit_amount: {
        currency_code: string;
        value: string;
      };
      tax?: {
        currency_code: string;
        value: string;
      };
      quantity: string;
      description?: string;
      sku?: string;
      category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS' | 'DONATION';
    }>;
  }>;
  payer?: {
    name?: {
      given_name: string;
      surname: string;
    };
    email_address: string;
    payer_id?: string;
    address?: {
      country_code: string;
    };
  };
  create_time: string;
  update_time: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalPayout {
  batch_header: {
    payout_batch_id: string;
    batch_status: 'DENIED' | 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'CANCELED';
    time_created: string;
    time_completed?: string;
    sender_batch_header: {
      sender_batch_id: string;
      email_subject: string;
      email_message: string;
    };
    amount: {
      currency: string;
      value: string;
    };
    fees: {
      currency: string;
      value: string;
    };
  };
  items?: Array<{
    payout_item_id: string;
    transaction_id?: string;
    transaction_status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'UNCLAIMED' | 'RETURNED' | 'ONHOLD' | 'BLOCKED' | 'REFUNDED' | 'REVERSED';
    payout_batch_id: string;
    payout_item_fee: {
      currency: string;
      value: string;
    };
    payout_item: {
      recipient_type: 'EMAIL' | 'PHONE' | 'PAYPAL_ID';
      amount: {
        currency: string;
        value: string;
      };
      note?: string;
      receiver: string;
      sender_item_id?: string;
    };
    time_processed?: string;
  }>;
}

export interface PayPalDashboardData {
  totalRevenue: number;
  totalPayouts: number;
  activeSubscriptions: number;
  pendingPayments: number;
  recentTransactions: PayPalPayment[];
  subscriptionMetrics: {
    newSubscriptions: number;
    cancelledSubscriptions: number;
    renewals: number;
  };
  payoutMetrics: {
    successfulPayouts: number;
    failedPayouts: number;
    pendingPayouts: number;
  };
}
