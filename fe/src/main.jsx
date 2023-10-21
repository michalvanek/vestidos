import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";

// Font Awesome icons
import "@fortawesome/fontawesome-free/css/all.css";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import $ from "jquery";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
