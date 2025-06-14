
import { ErrorType } from './errors';

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
  const errorObj = new Error('Unknown error occurred');
  console.error(`${type} Error:`, errorObj.message);
  return errorObj;
};

export const errorHandler = {
  handleError: (error: Error, context?: string) => {
    console.error(`Error ${context ? `in ${context}` : ''}:`, error);
  }
};

export { type ErrorType };
