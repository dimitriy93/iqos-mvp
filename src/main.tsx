import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './app/App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)