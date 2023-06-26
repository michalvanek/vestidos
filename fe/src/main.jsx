import React from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from "./App";
import "./index.css";

render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="app" />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
