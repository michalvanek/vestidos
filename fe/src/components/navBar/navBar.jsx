import { useState, useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import LoginModal from "../modalWindows/loginModal";
import { LoginContext } from "../../context/loginContext";
import { scroller } from "react-scroll";

const NavBar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { isLoggedIn, logout } = useContext(LoginContext);
  const location = useLocation(); // Get the current location
  const navBarHeight = 60;

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from LoginContext
  };

  return (
    <>
      <div className="navbar-container sticky-top">
        <Navbar expand="lg" variant="light">
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleMenu}
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={menuVisible ? "show" : ""}
          >
            <Nav className="mr-auto">
              {location.pathname === "/" ? ( // Check if on the home page
                <Nav.Link
                  onClick={() =>
                    scroller.scrollTo("inicio", {
                      smooth: true,
                      offset: -navBarHeight,
                      duration: 500,
                    })
                  }
                >
                  Inicio
                </Nav.Link>
              ) : (
                <Nav.Link as={NavLink} to="/">
                  Home
                </Nav.Link>
              )}
              {location.pathname === "/" ? ( // Check if on the home page
                <Nav.Link
                  onClick={() =>
                    scroller.scrollTo("catalogueTop", {
                      smooth: true,
                      offset: -navBarHeight,
                      duration: 500,
                    })
                  }
                >
                  Catálogo
                </Nav.Link>
              ) : undefined}
              {location.pathname === "/" ? ( // Check if on the home page
                <Nav.Link
                  onClick={() =>
                    scroller.scrollTo("contact", {
                      smooth: true,
                      offset: -navBarHeight,
                      duration: 500,
                    })
                  }
                >
                  Contacto
                </Nav.Link>
              ) : undefined}
            </Nav>

            <Nav>
              {isLoggedIn && (
                <>
                  <Nav.Link as={NavLink} to="/admin">
                    Administración
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/newRent">
                    Nueva renta
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              ) : (
                <Nav.Link onClick={openModal}>Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <Outlet />
      <LoginModal isOpen={modalIsOpen} closeModal={closeModal} />
    </>
  );
};

export default NavBar;
