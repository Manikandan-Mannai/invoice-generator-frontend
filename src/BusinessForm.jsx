import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BusinessForm = () => {
  const [form, setForm] = useState({
    driverName: "",
    vehicleNumber: "",
    vehicleType: "",
    licenseNumber: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    companyLogoUrl: "",
    currency: "INR",
    gstNumber: "",
    contactEmail: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/business", form, {
        withCredentials: true,
      });
      navigate("/home");
    } catch (err) {
      console.error("❌ Error creating business profile:", err);
      alert("Failed to save. Check console.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Setup Driver Business Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="driverName"
          placeholder="Driver Name"
          required
          onChange={handleChange}
        />
        <br />
        <input
          name="vehicleNumber"
          placeholder="Vehicle Number"
          required
          onChange={handleChange}
        />
        <br />
        <input
          name="vehicleType"
          placeholder="Vehicle Type"
          onChange={handleChange}
        />
        <br />
        <input
          name="licenseNumber"
          placeholder="License Number"
          onChange={handleChange}
        />
        <br />
        <input
          name="phone"
          placeholder="Phone Number"
          required
          onChange={handleChange}
        />
        <br />
        <input
          name="contactEmail"
          placeholder="Contact Email"
          onChange={handleChange}
        />
        <br />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <br />
        <input name="city" placeholder="City" onChange={handleChange} />
        <br />
        <input name="state" placeholder="State" onChange={handleChange} />
        <br />
        <input name="pinCode" placeholder="Pin Code" onChange={handleChange} />
        <br />
        <input
          name="gstNumber"
          placeholder="GST Number"
          onChange={handleChange}
        />
        <br />
        <input
          name="companyLogoUrl"
          placeholder="Company Logo URL"
          onChange={handleChange}
        />
        <br />
        <button type="submit" style={{ marginTop: "1rem" }}>
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default BusinessForm;
