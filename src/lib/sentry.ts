import * as Sentry from "@sentry/react";
import { browserTracingIntegration, replayIntegration } from "@sentry/browser";

export const initSentry = () => {
  if (process.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [
        browserTracingIntegration(),
        replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample rate for all sessions
      replaysOnErrorSampleRate: 1.0, // Sample rate for sessions with errors
      enabled: process.env.NODE_ENV === 'production'
    });
  }
};