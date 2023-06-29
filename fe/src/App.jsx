import React from "react";
// import "./scss/main.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Catalogue from "./pages/catalogue";
import About from "./pages/about";
import NavBar from "./components/navBar/navBar";

let App = () => {
  return (
    <React.Fragment>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="catalogue" />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
};

export default App;
