import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch the logged-in user's profile data from the backend
    axios
      .get("http://localhost:5000/api/users/profile", { withCredentials: true })
      .then((response) => {
        setUser(response.data); // Set user data
      })
      .catch((error) => {
        console.log("Error fetching user profile:", error);
        navigate("/"); // Redirect to login page if not authenticated
      });
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <img src={user.avatar} alt="User Avatar" />
    </div>
  );
};

export default Profile;
