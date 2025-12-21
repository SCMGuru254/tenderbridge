import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Prevent third-party injected scripts (extensions / OEM WebViews) from crashing the app.
window.addEventListener('unhandledrejection', (event) => {
  const reason: any = (event as any).reason;
  const message = String(reason?.message ?? reason ?? '');
  const stack = String(reason?.stack ?? '');

  // Common MetaMask-injected error signature
  if (
    message.toLowerCase().includes('metamask') ||
    stack.includes('chrome-extension://')
  ) {
    event.preventDefault();
  }
});

console.log("[DEBUG] main.tsx - Starting app initialization");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);