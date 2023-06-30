import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginProvider, { LoginContext } from "./context/loginContext"; // Import the LoginProvider
import Catalogue from "./pages/catalogue";
import About from "./pages/about";
import MenuAdmin from "./pages/menuAdmin";
import NavBar from "./components/navBar/navBar";

let App = () => {
  return (
    <React.Fragment>
      <Router>
        <LoginProvider>
          {" "}
          {/* Add the LoginProvider here */}
          <NavBar />
          <Routes>
            <Route path="/" element={<Navigate to="catalogue" />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<MenuAdmin />} />
          </Routes>
        </LoginProvider>
      </Router>
    </React.Fragment>
  );
};

export default App;
