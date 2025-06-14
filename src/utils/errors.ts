
export type ErrorType = 'NETWORK' | 'SERVER' | 'CLIENT' | 'VALIDATION' | 'AUTH';

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
}

export const createError = (type: ErrorType, message: string, code?: string, details?: any): AppError => ({
  type,
  message,
  code,
  details
});

export const handleError = (error: AppError | Error, type?: ErrorType) => {
  if (error instanceof Error) {
    console.error(`${type || 'UNKNOWN'} Error:`, error.message);
    return createError(type || 'CLIENT', error.message);
  }
  
  console.error(`${error.type} Error:`, error.message);
  return error;
};
