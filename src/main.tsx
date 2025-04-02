
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import SecurityMiddleware from './components/SecurityMiddleware.tsx'

// CSP using meta tag (would be better as HTTP header in production)
const cspMeta = document.createElement('meta');
cspMeta.httpEquiv = 'Content-Security-Policy';
cspMeta.content = "default-src 'self'; script-src 'self'; connect-src 'self' https://*.supabase.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:;";
document.head.appendChild(cspMeta);

// XSS protection using meta tag
const xssMeta = document.createElement('meta');
xssMeta.httpEquiv = 'X-XSS-Protection';
xssMeta.content = '1; mode=block';
document.head.appendChild(xssMeta);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SecurityMiddleware />
    <App />
  </React.StrictMode>,
)
