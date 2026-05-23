import React from 'react';
import { createRoot } from 'react-dom/client';
import { PrivacyPage } from './pages/PrivacyPage';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivacyPage />
  </React.StrictMode>
);
