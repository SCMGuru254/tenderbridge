// Common shared types used across the application

export interface GenericRecord {
  [key: string]: string | number | boolean | null | GenericRecord | GenericRecord[];
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  meta?: {
    count?: number;
    page?: number;
    totalPages?: number;
  };
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface MetricData {
  timestamp: string;
  value: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface EventData {
  type: string;
  data: unknown;
  timestamp?: string;
}

export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  signature?: string;
}

// Performance monitoring types
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Error tracking types
export interface ErrorEvent {
  message: string;
  stack?: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

// Browser event types
export interface EventSubscription {
  unsubscribe: () => void;
}

export interface EventEmitterConfig {
  maxListeners?: number;
  debug?: boolean;
}
