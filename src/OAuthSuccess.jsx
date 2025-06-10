// src/pages/OAuthSuccess.jsx
import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const OAuthSuccess = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Step 1: Get the token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Step 2: Decode the token
      const decoded = jwtDecode(token);
      setUser(decoded);

      // Step 3: Optional - Store token for future API calls
      localStorage.setItem("token", token);
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default OAuthSuccess;
