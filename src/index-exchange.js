import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index-exchange.css';
import App from './App-exchange';

// Setup Axios once here
axios.defaults.headers = { Accept: 'application/json' };
const axiosInstance = axios.create({
    baseURL: process.env.KB_API_BASE_URL
});

export default axiosInstance;

// Find all widget divs
const widgetDivs = document.querySelectorAll('.kb-exchange-full-widget');

// Inject our React App into each class
widgetDivs.forEach(div => {
    ReactDOM.render(
      <React.StrictMode>
        <App/>
      </React.StrictMode>,
        div
    );
});
