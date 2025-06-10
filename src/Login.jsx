import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import axios from "axios";

const Login = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = () => {
    // navigate("")
    window.location.href = "http://localhost:5000/auth/google"; 
  };

  return (
    <div className="login-container">
      <h2>Login with Google</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
