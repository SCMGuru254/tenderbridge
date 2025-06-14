
import { AppError, ErrorType, createError } from './errors';

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorType: ErrorType = 'CLIENT'
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${errorType} Error:`, error.message);
      return null;
    }
    throw error;
  }
};

export const handleAsyncError = (error: unknown, type: ErrorType = 'CLIENT'): AppError => {
  if (error instanceof Error) {
    return createError(type, error.message);
  }
  return createError(type, 'Unknown error occurred');
};

export const errorHandler = {
  handleError: (error: unknown, type: ErrorType = 'CLIENT'): AppError => {
    if (error instanceof Error) {
      console.error(`${type} Error:`, error.message);
      return createError(type, error.message);
    }
    return createError(type, 'Unknown error occurred');
  }
};

export { ErrorType } from './errors';
