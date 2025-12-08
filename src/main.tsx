import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Service worker registration disabled to prevent caching issues
// The app will still work fine without it
// TODO: Re-enable once caching strategy is properly configured

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