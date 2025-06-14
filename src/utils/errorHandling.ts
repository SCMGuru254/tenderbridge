
import { errorHandler, type ErrorType } from './errors';

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

export const handleAsyncError = (error: unknown, type: ErrorType = 'CLIENT') => {
  if (error instanceof Error) {
    console.error(`${type} Error:`, error.message);
    return error;
  }
  return new Error('Unknown error occurred');
};

export { errorHandler, type ErrorType };
