import { useState, useContext } from "react";
import { Modal, Button, Alert } from "react-bootstrap"; // Import Bootstrap components
import { LoginContext } from "../../context/loginContext";

const LoginModal = ({ isOpen, closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(LoginContext);

  const handleLogin = () => {
    // Make a request to login
    login(email, password)
      .then(() => {
        // Handle successful login
        closeModal();
      })
      .catch((error) => {
        // Handle login error
        console.error(error);
        setError(
          `${error.message} - ${JSON.stringify(error.response.data, null, 2)}`
        ); // Set error as a string message
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <Modal show={isOpen} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <label>Email:</label>
              <div className="mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label>Password:</label>
              <div className="mb-2">
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="secondary" onClick={closeModal}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
