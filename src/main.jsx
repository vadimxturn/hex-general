import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { captureAttribution } from './lib/attribution.js';
import './styles.css';

captureAttribution();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
