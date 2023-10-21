import {
  BrowserRouter as Router,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import LoginProvider from "./context/loginContext"; // Import the LoginProvider
import Catalogue from "./pages/catalogue";
import About from "./pages/about";
import MenuAdmin from "./pages/menuAdmin";
import NavBar from "./components/navBar/navBar";
import EditDress from "./pages/editDress";
import NewRent from "./pages/newRent";
import LogoutPage from "./pages/logoutPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavBar />}>
      <Route index element={<Catalogue />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin" element={<MenuAdmin />} />
      <Route path="/newRent" element={<NewRent />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/:dressId" element={<EditDress />} />
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
