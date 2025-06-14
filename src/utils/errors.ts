
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
