interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

interface UserProperties {
  userId?: string;
  userType?: string;
  deviceType?: string;
  platform?: string;
}

class Analytics {
  private static instance: Analytics;
  private userProperties: UserProperties = {};
  private events: AnalyticsEvent[] = [];

  private constructor() {
    this.initializeUserProperties();
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  private initializeUserProperties(): void {
    this.userProperties = {
      deviceType: this.getDeviceType(),
      platform: this.getPlatform(),
    };
  }

  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getPlatform(): string {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return 'android';
    if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
    if (/windows/i.test(ua)) return 'windows';
    if (/macintosh|mac os x/i.test(ua)) return 'macos';
    if (/linux/i.test(ua)) return 'linux';
    return 'unknown';
  }

  trackEvent(event: AnalyticsEvent): void {
    const enrichedEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      ...this.userProperties,
    };

    this.events.push(enrichedEvent);
    this.logEvent(enrichedEvent);
    this.sendToAnalyticsService(enrichedEvent);
  }

  private logEvent(event: AnalyticsEvent & { timestamp: string }): void {
    console.log('Analytics Event:', event);
  }

  private sendToAnalyticsService(event: AnalyticsEvent & { timestamp: string }): void {
    // In production, this would send to your analytics service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement analytics service integration
      // Example: Google Analytics, Mixpanel, etc.
    }
  }

  setUserProperties(properties: Partial<UserProperties>): void {
    this.userProperties = {
      ...this.userProperties,
      ...properties,
    };
  }

  trackPageView(path: string): void {
    this.trackEvent({
      category: 'Page',
      action: 'View',
      label: path,
    });
  }

  trackUserAction(action: string, label?: string): void {
    this.trackEvent({
      category: 'User',
      action,
      label,
    });
  }

  trackError(error: Error): void {
    this.trackEvent({
      category: 'Error',
      action: 'Occurred',
      label: error.message,
      properties: {
        stack: error.stack,
        name: error.name,
      },
    });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}

export const analytics = Analytics.getInstance(); 