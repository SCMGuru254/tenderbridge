
// Analytics utility for tracking user interactions and application performance
export interface AnalyticsEvent {
  event: string;
  data?: any;
  timestamp?: number;
  userId?: string;
}

export interface ErrorEvent {
  error: Error;
  context?: string;
  userId?: string;
  timestamp: number;
}

export interface UserAction {
  action: string;
  data?: any;
  userId?: string;
  timestamp: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private errors: ErrorEvent[] = [];
  private userActions: UserAction[] = [];

  trackEvent(event: string, data?: any, userId?: string) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      data,
      userId,
      timestamp: Date.now()
    };
    
    this.events.push(analyticsEvent);
    console.log('Analytics Event:', analyticsEvent);
    
    // In production, send to analytics service
    this.sendToAnalyticsService(analyticsEvent);
  }

  trackError(error: Error, context?: string, userId?: string) {
    const errorEvent: ErrorEvent = {
      error,
      context,
      userId,
      timestamp: Date.now()
    };
    
    this.errors.push(errorEvent);
    console.error('Analytics Error:', errorEvent);
    
    // In production, send to error tracking service
    this.sendToErrorTracking(errorEvent);
  }

  trackUserAction(action: string, data?: any, userId?: string) {
    const userAction: UserAction = {
      action,
      data,
      userId,
      timestamp: Date.now()
    };
    
    this.userActions.push(userAction);
    console.log('User Action:', userAction);
    
    // In production, send to analytics service
    this.sendUserActionToAnalytics(userAction);
  }

  private sendToAnalyticsService(analyticsEvent: AnalyticsEvent) {
    // Mock implementation - replace with actual analytics service
    // e.g., Google Analytics, Mixpanel, etc.
  }

  private sendToErrorTracking(errorEvent: ErrorEvent) {
    // Mock implementation - replace with actual error tracking service
    // e.g., Sentry, Bugsnag, etc.
  }

  private sendUserActionToAnalytics(userAction: UserAction) {
    // Mock implementation - replace with actual analytics service
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  getUserActions(): UserAction[] {
    return [...this.userActions];
  }

  clearEvents() {
    this.events = [];
  }

  clearErrors() {
    this.errors = [];
  }

  clearUserActions() {
    this.userActions = [];
  }
}

export const analytics = new AnalyticsService();
