// TEMPORARY: resources/js/app.jsx for testing mounting
import './bootstrap';
import '../sass/app.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './components/Home';

function App() {
    return (
        <div style={{ padding: '20px', border: '2px solid green' }}>
            <h1>React App Loaded Successfully!</h1>
            <p>If you see this, React is working. The issue is in routing or other components.</p>
        </div>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <App >
            <Home/>
            </App>
        </React.StrictMode>
    );
}