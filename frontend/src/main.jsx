import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import api from './api/axios';

api.get('/csrf/').catch(() => {
  console.warn('Не удалось получить CSRF-токен');
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);