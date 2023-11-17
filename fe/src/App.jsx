import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import LoginProvider from "./context/loginContext"; // Import the LoginProvider
import Catalogue from "./pages/catalogue";
import MenuAdmin from "./pages/menuAdmin";
import NavBar from "./components/navBar/navBar";
import EditDress from "./pages/editDress";
import NewRent from "./pages/newRent";
import LogoutPage from "./pages/logoutPage";
import ErrorPage from "./pages/errorPage";
import { ProtectedRoute } from "./components/protectedRoute/protectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavBar />} errorElement={<ErrorPage />}>
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Catalogue />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<MenuAdmin />} />
          <Route path="/newRent" element={<NewRent />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/:dressId" element={<EditDress />} />
        </Route>
      </Route>
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
