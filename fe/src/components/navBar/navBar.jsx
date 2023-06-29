import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoginModal from "../loginModal/loginModal"; // Update the import statement

const NavBar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">
          Logo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleMenu} />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className={menuVisible ? "show" : ""}
        >
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              Catálogo
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              Acerca de nosotros
            </Nav.Link>
            <Nav.Link onClick={openModal}>Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <LoginModal isOpen={modalIsOpen} closeModal={closeModal} />{" "}
      {/* Render the LoginModal component */}
    </>
  );
};

export default NavBar;
