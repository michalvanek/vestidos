import React from "react";
import {
  BrowserRouter as Router,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import LoginProvider, { LoginContext } from "./context/loginContext"; // Import the LoginProvider
import Catalogue from "./pages/catalogue";
import About from "./pages/about";
import MenuAdmin from "./pages/menuAdmin";
import NavBar from "./components/navBar/navBar";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavBar />}>
      <Route index element={<Catalogue />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin" element={<MenuAdmin />} />
    </Route>
  )
);

let App = () => {
  return (
    <>
      <LoginProvider>
        <RouterProvider router={router} />
      </LoginProvider>
    </>
  );
};

export default App;
