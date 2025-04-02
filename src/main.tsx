
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import SecurityMiddleware from './components/SecurityMiddleware.tsx'

// Enhanced CSP using meta tag (would be better as HTTP header in production)
const cspMeta = document.createElement('meta');
cspMeta.httpEquiv = 'Content-Security-Policy';
cspMeta.content = "default-src 'self'; script-src 'self'; connect-src 'self' https://*.supabase.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-ancestors 'none';";
document.head.appendChild(cspMeta);

// XSS protection using meta tag
const xssMeta = document.createElement('meta');
xssMeta.httpEquiv = 'X-XSS-Protection';
xssMeta.content = '1; mode=block';
document.head.appendChild(xssMeta);

// X-Content-Type-Options to prevent MIME type sniffing
const contentTypeMeta = document.createElement('meta');
contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
contentTypeMeta.content = 'nosniff';
document.head.appendChild(contentTypeMeta);

// Referrer-Policy header to control referrer information
const referrerMeta = document.createElement('meta');
referrerMeta.httpEquiv = 'Referrer-Policy';
referrerMeta.content = 'strict-origin-when-cross-origin';
document.head.appendChild(referrerMeta);

// Permissions-Policy to limit features
const permissionsMeta = document.createElement('meta');
permissionsMeta.httpEquiv = 'Permissions-Policy';
permissionsMeta.content = 'camera=(), microphone=(), geolocation=()';
document.head.appendChild(permissionsMeta);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SecurityMiddleware />
    <App />
  </React.StrictMode>,
)
