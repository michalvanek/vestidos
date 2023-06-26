import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Catalogue from "./pages/catalogue";
import "./index.css";
import NavBar from "./components/navBar/navBar";

let App = () => {
  return (
    <React.Fragment>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="catalogue" />} />
          <Route path="/catalogue" element={<Catalogue />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
};

export default App;
