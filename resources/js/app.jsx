// resources/js/app.js
//require('./bootstrap'); // Includes Axios, Lodash, etc.

import React from 'react';
import ReactDOM from  "react-dom/client"
import App from './components/App'; // Import your main App component

// Optional: Import Bootstrap JavaScript (if you want its JS features like dropdowns)
import 'bootstrap';

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);