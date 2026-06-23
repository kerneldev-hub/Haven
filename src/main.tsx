import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register progressive web application service worker for instant page updates & offline loading
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('Haven PWA ServiceWorker successfully registered with scope: ', reg.scope);
      })
      .catch((err) => {
        console.warn('Haven PWA ServiceWorker registration failed: ', err);
      });
  });
}

