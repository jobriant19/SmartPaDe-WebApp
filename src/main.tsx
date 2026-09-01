import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { IoTProvider } from './contexts/IoTContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <IoTProvider>
        <App />
      </IoTProvider>
    </LanguageProvider>
  </StrictMode>,
);
