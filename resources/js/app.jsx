// resources/js/app.js
import React from 'react';
import ReactDOM from "react-dom/client";
import Main from './components/Main'; // We'll create this Main.jsx file next

// Import Bootstrap's JavaScript to enable features like the navbar toggler
import 'bootstrap';

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);