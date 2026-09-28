import React from "react";
import ReactDOM from "react-dom/client";
import { loadSampleReport } from "./dev/loadSampleReport";
import "./i18n";

if (import.meta.env.VITE_LOAD_SAMPLE_REPORT === "true") {
    loadSampleReport();
}
import "./styles/jgivenreport.css";
import "./styles/tooltip.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
