import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

if (window.location.hash.startsWith("#/")) {
  const cleanPath = window.location.hash.slice(1);
  window.history.replaceState(null, "", cleanPath);
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
