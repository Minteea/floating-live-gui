import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
declare const BASENAME: string
declare const NODE_ENV: string

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {
      NODE_ENV == "production" ?
      <HashRouter>
        <App />
      </HashRouter>
      :
      <BrowserRouter basename={BASENAME}>
        <App />
      </BrowserRouter>
    }
  </React.StrictMode>
);
