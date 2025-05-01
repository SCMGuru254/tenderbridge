export class JobServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'JobServiceError';
  }
}

export class ValidationError extends JobServiceError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends JobServiceError {
  constructor(message: string, details?: any) {
    super(message, 'RATE_LIMIT', details);
    this.name = 'RateLimitError';
  }
}

export class FetchError extends JobServiceError {
  constructor(message: string, details?: any) {
    super(message, 'FETCH_ERROR', details);
    this.name = 'FetchError';
  }
} 