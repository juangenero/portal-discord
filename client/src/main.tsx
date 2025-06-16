// import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@/styles/globals.css';
// import React from 'react';
import App from './App.tsx';
import { AuthProvider } from './modules/auth/AuthContext.tsx';
import { Provider } from './provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
