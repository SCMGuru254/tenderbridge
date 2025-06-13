import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: any, type: ErrorType = ErrorType.UNKNOWN): void {
    const appError: AppError = {
      type,
      message: error.message || 'An unexpected error occurred',
      details: error,
      timestamp: new Date()
    };

    this.errorLog.push(appError);
    this.showErrorToUser(appError);
    this.logError(appError);
  }

  private showErrorToUser(error: AppError): void {
    const errorMessages: Record<ErrorType, string> = {
      [ErrorType.NETWORK]: 'Network error. Please check your connection.',
      [ErrorType.AUTH]: 'Authentication error. Please log in again.',
      [ErrorType.VALIDATION]: 'Invalid input. Please check your data.',
      [ErrorType.SERVER]: 'Server error. Please try again later.',
      [ErrorType.UNKNOWN]: 'An unexpected error occurred.'
    };

    toast.error(errorMessages[error.type] || error.message);
  }

  private logError(error: AppError): void {
    console.error('Error:', {
      type: error.type,
      message: error.message,
      timestamp: error.timestamp,
      details: error.details
    });

    // In production, this would send to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement error tracking service integration
    }
  }

  getErrorLog(): AppError[] {
    return this.errorLog;
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Custom error classes
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError';
  }
}

// Error boundary component
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    ErrorHandler.getInstance().handleError(error);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                type="button"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 