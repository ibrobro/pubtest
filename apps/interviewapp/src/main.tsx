import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Home from './app/home';

/**
 * Application Entry Point
 * Get HTML root element and attach Home component 
 */


// Root element
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render
root.render(
  <StrictMode>
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  </StrictMode>
);
