
export type ErrorType = 'CLIENT' | 'SERVER' | 'NETWORK' | 'VALIDATION';

export interface AppError {
  type: ErrorType;
  message: string;
  timestamp: Date;
}

export const createError = (type: ErrorType, message: string): AppError => ({
  type,
  message,
  timestamp: new Date()
});

export interface ErrorHandler {
  handleError: (error: Error, context?: string) => void;
}

class ErrorHandlerImpl implements ErrorHandler {
  handleError(error: Error, context?: string): void {
    console.error(`Error ${context ? `in ${context}` : ''}:`, error);
    
    // Here you could add additional error reporting logic
    // such as sending to an error tracking service
  }
}

export const errorHandler = new ErrorHandlerImpl();
