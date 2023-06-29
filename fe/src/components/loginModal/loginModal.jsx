import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

const LoginModal = ({ isOpen, closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // Make a request to login
    axios
      .post("http://localhost:5001/api/users/login", { email, password })
      .then((response) => {
        // Handle successful login
        console.log(response.data);
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
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={closeModal}>Close</button>
    </Modal>
  );
};

export default LoginModal;
