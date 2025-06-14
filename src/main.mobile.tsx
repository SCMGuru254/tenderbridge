
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Capacitor } from '@capacitor/core'

// Mobile-specific initialization
if (Capacitor.isNativePlatform()) {
  console.log('Running on native platform');
  
  // Hide splash screen when ready
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, hiding splash screen');
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
