import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18n from "i18next"
import {initReactI18next} from "react-i18next";
import en from "./i18n/en.json";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

i18n.use(initReactI18next)
    .init( {resources : {
        en: {translation: en}
        },
        lng: "en",
        fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
