import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { LoginContext } from "../../context/loginContext";

const LoginModal = ({ isOpen, closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(LoginContext);

  useEffect(() => {
    Modal.setAppElement("#root"); // Set the app element for accessibility
  }, []);

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
        setError("Invalid email or password");
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <label>Email:</label>
            <div className="mb-2">
              <input type="email" value={email} onChange={handleEmailChange} />
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
        <button onClick={handleLogin}>Login</button>
        <button onClick={closeModal}>Close</button>
      </div>
    </Modal>
  );
};

export default LoginModal;
