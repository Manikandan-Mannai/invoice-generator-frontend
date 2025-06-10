import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login"; // Import Login component
import Profile from "./Profile"; // Import Profile component
import BusinessForm from "./BusinessForm";
import InvoiceForm from "./InvoiceForm";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <h1>Invoice Generator App</h1>
        <Routes>
          {/* Route for Login */}
          <Route path="/" element={<Login />} />

          {/* Route for User Profile (after successful login) */}
          <Route path="/profile" element={<Profile />} />

          {/* You can add other routes as needed */}
          <Route path="/setup-business-profile" element={<BusinessForm />} />
          <Route path="/invoice" element={<InvoiceForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
