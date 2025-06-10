import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const InvoiceForm = () => {
  const [business, setBusiness] = useState({});
  const [form, setForm] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    driverName: "",
    vehicleNumber: "",
    serviceCategory: "",
    sacCode: "",
    customerName: "",
    placeToSupply: "",
    gstin: "",
    companyName: "",
    bookingId: "",
    tripType: "oneway",
    origin: "",
    destination: "",
    tripDateFrom: "",
    tripDateTo: "",
    guestDetails: [""],
    baseFare: "",
    discount: 0,
    tollTax: 0,
    igstPercentage: 0,
    igstAmount: 0,
    grandTotal: "",
    walletAmount: 0,
    cashAmount: 0,
    upiAmount: 0,
    paymentMethod: "cash",
    terms: "",
    authorizedSignature: "",
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/business/me", {
          withCredentials: true,
        });
        setBusiness(res.data);
        setForm((prev) => ({
          ...prev,
          driverName: res.data.driverName || "",
          vehicleNumber: res.data.vehicleNumber || "",
          businessInfo: {
            name: res.data.name || "",
            telNo: res.data.telNo || "",
            website: res.data.website || "",
            supportEmail: res.data.supportEmail || "",
          },
        }));
      } catch (err) {
        console.error("❌ Error fetching business profile:", err);
      }
    };
    fetchBusiness();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value })); // Use prev in callback
    }
  };

  const handleGuestChange = (index, value) => {
    const updatedGuests = [...form.guestDetails];
    updatedGuests[index] = value;
    setForm((prev) => ({ ...prev, guestDetails: updatedGuests }));
  };

  const addGuest = () => {
    setForm({ ...form, guestDetails: [...form.guestDetails, ""] });
  };

  const generatePDF = (download = false) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Original Tax Invoice", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);

    // Invoice Details (Left Top)
    doc.text("Invoice Details:", 20, 30);
    doc.text(`Invoice No: ${form.invoiceNumber}`, 20, 38);
    doc.text(`Date: ${form.invoiceDate}`, 20, 45);
    doc.text(`Driver: ${form.driverName}`, 20, 52);
    doc.text(`Car Number: ${form.vehicleNumber}`, 20, 59);
    doc.text(`Service Category: ${form.serviceCategory}`, 20, 66);
    doc.text(`SAC Code: ${form.sacCode}`, 20, 73);

    // Customer Details (Right Top)
    doc.text("Customer Details:", 120, 30);
    doc.text(`Customer Name: ${form.customerName}`, 120, 38);
    doc.text(`Place to Supply: ${form.placeToSupply}`, 120, 45);
    doc.text(`GSTIN No: ${form.gstin}`, 120, 52);
    doc.text(`Company: ${form.companyName}`, 120, 59);

    // Divider
    doc.setDrawColor(200);
    doc.line(20, 80, 190, 80);

    // Trip Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Trip Details: ${form.bookingId}`, 20, 90);
    doc.text(
      `${form.tripType.charAt(0).toUpperCase() + form.tripType.slice(1)} ${
        form.origin
      } to ${form.destination}`,
      20,
      97
    );
    doc.text(`From: ${form.tripDateFrom} To: ${form.tripDateTo}`, 20, 104);
    doc.text("Guest Details:", 20, 111);
    form.guestDetails.forEach((guest, index) => {
      doc.text(`0${index + 1}. ${guest}`, 30, 118 + index * 7);
    });

    // Fare Details Table
    doc.setFontSize(12);
    doc.text("Fare Details", 20, 130 + form.guestDetails.length * 7);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Fare/Charge", 20, 138 + form.guestDetails.length * 7);
    doc.text("QTY", 80, 138 + form.guestDetails.length * 7);
    doc.text("Rate", 100, 138 + form.guestDetails.length * 7);
    doc.text("Amount", 130, 138 + form.guestDetails.length * 7);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    let y = 145 + form.guestDetails.length * 7;
    doc.text("Base Fare", 20, y);
    doc.text("1", 80, y);
    doc.text(`Rs. ${form.baseFare}`, 100, y);
    doc.text(`Rs. ${form.baseFare}`, 130, y);
    y += 7;
    doc.text("Discount", 20, y);
    doc.text("-", 80, y);
    doc.text("-", 100, y);
    doc.text(`Rs. ${form.discount}`, 130, y);
    y += 7;
    doc.text("Toll Tax", 20, y);
    doc.text("-", 80, y);
    doc.text("-", 100, y);
    doc.text(`Rs. ${form.tollTax}`, 130, y);
    y += 7;
    doc.text(`IGST @ ${form.igstPercentage}%`, 20, y);
    doc.text("-", 80, y);
    doc.text("-", 100, y);
    doc.text(`Rs. ${form.igstAmount}`, 130, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", 20, y);
    doc.text(`Rs. ${form.grandTotal}`, 130, y);

    // Payment Details
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Payment Details:", 20, y);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    y += 7;
    doc.text(
      `${form.tripType.charAt(0).toUpperCase() + form.tripType.slice(1)} ${
        form.paymentMethod.charAt(0).toUpperCase() + form.paymentMethod.slice(1)
      }`,
      20,
      y
    );
    doc.text(`Wallet: Rs. ${form.walletAmount}`, 20, y + 7);
    doc.text(`Cash: Rs. ${form.cashAmount}`, 60, y + 7);
    doc.text(`UPI: Rs. ${form.upiAmount}`, 100, y + 7);

    // Terms
    if (form.terms) {
      y += 14;
      doc.text("Terms:", 20, y);
      doc.text(form.terms, 30, y + 7);
    }

    // Authorized Signature
    y += 14;
    doc.text("Authorised Signature", 140, y);
    doc.line(140, y + 2, 190, y + 2);

    // Business Info
    y += 10;
    doc.text("Business Info:", 20, y);
    doc.text(`Name: ${form.businessInfo?.name || ""}`, 20, y + 7);
    doc.text(`Tel No: ${form.businessInfo?.telNo || ""}`, 20, y + 14);
    doc.text(`Website: ${form.businessInfo?.website || ""}`, 20, y + 21);
    doc.text(
      `For help/support: ${form.businessInfo?.supportEmail || ""}`,
      20,
      y + 28
    );

    if (download) {
      doc.save("taxi_invoice.pdf");
    } else {
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Create Taxi Invoice</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          name="invoiceNumber"
          placeholder="Invoice Number"
          required
          onChange={handleChange}
          value={form.invoiceNumber}
        />
        <br />
        <input
          type="date"
          name="invoiceDate"
          placeholder="Invoice Date"
          required
          onChange={handleChange}
          value={form.invoiceDate}
        />
        <br />
        <input
          name="driverName"
          placeholder="Driver Name"
          required
          onChange={handleChange}
          value={form.driverName}
        />
        <br />
        <input
          name="vehicleNumber"
          placeholder="Vehicle Number"
          required
          onChange={handleChange}
          value={form.vehicleNumber}
        />
        <br />
        <input
          name="serviceCategory"
          placeholder="Service Category"
          required
          onChange={handleChange}
          value={form.serviceCategory}
        />
        <br />
        <input
          name="sacCode"
          placeholder="SAC Code"
          onChange={handleChange}
          value={form.sacCode}
        />
        <br />
        <input
          name="customerName"
          placeholder="Customer Name"
          required
          onChange={handleChange}
          value={form.customerName}
        />
        <br />
        <input
          name="placeToSupply"
          placeholder="Place to Supply"
          onChange={handleChange}
          value={form.placeToSupply}
        />
        <br />
        <input
          name="gstin"
          placeholder="GSTIN"
          onChange={handleChange}
          value={form.gstin}
        />
        <br />
        <input
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          value={form.companyName}
        />
        <br />
        <input
          name="bookingId"
          placeholder="Booking ID"
          required
          onChange={handleChange}
          value={form.bookingId}
        />
        <br />
        <select name="tripType" onChange={handleChange} value={form.tripType}>
          <option value="oneway">Oneway</option>
          <option value="roundtrip">Roundtrip</option>
        </select>
        <br />
        <input
          name="origin"
          placeholder="Origin"
          required
          onChange={handleChange}
          value={form.origin}
        />
        <br />
        <input
          name="destination"
          placeholder="Destination"
          required
          onChange={handleChange}
          value={form.destination}
        />
        <br />
        <input
          type="date"
          name="tripDateFrom"
          placeholder="Trip Date From"
          required
          onChange={handleChange}
          value={form.tripDateFrom}
        />
        <br />
        <input
          type="date"
          name="tripDateTo"
          placeholder="Trip Date To"
          required
          onChange={handleChange}
          value={form.tripDateTo}
        />
        <br />
        {form.guestDetails.map((guest, index) => (
          <div key={index}>
            <input
              placeholder={`Guest ${index + 1}`}
              value={guest}
              onChange={(e) => handleGuestChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addGuest}>
          Add Guest
        </button>
        <br />
        <input
          type="number"
          name="baseFare"
          placeholder="Base Fare"
          required
          onChange={handleChange}
          value={form.baseFare}
        />
        <br />
        <input
          type="number"
          name="discount"
          placeholder="Discount"
          onChange={handleChange}
          value={form.discount}
        />
        <br />
        <input
          type="number"
          name="tollTax"
          placeholder="Toll Tax"
          onChange={handleChange}
          value={form.tollTax}
        />
        <br />
        <input
          type="number"
          name="igstPercentage"
          placeholder="IGST Percentage"
          onChange={handleChange}
          value={form.igstPercentage}
        />
        <br />
        <input
          type="number"
          name="igstAmount"
          placeholder="IGST Amount"
          onChange={handleChange}
          value={form.igstAmount}
        />
        <br />
        <input
          type="number"
          name="grandTotal"
          placeholder="Grand Total"
          required
          onChange={handleChange}
          value={form.grandTotal}
        />
        <br />
        <input
          type="number"
          name="walletAmount"
          placeholder="Wallet Amount"
          onChange={handleChange}
          value={form.walletAmount}
        />
        <br />
        <input
          type="number"
          name="cashAmount"
          placeholder="Cash Amount"
          onChange={handleChange}
          value={form.cashAmount}
        />
        <br />
        <input
          type="number"
          name="upiAmount"
          placeholder="UPI Amount"
          onChange={handleChange}
          value={form.upiAmount}
        />
        <br />
        <select
          name="paymentMethod"
          onChange={handleChange}
          value={form.paymentMethod}
        >
          <option value="cash">Cash</option>
          <option value="wallet">Wallet</option>
          <option value="upi">UPI</option>
        </select>
        <br />
        <textarea
          name="terms"
          placeholder="Terms (optional)"
          onChange={handleChange}
          value={form.terms}
        />
        <br />
        <input
          name="authorizedSignature"
          placeholder="Authorized Signature"
          onChange={handleChange}
          value={form.authorizedSignature}
        />
        <br />
        <button type="button" onClick={() => generatePDF(false)}>
          Preview
        </button>
        <button
          type="button"
          onClick={() => generatePDF(true)}
          style={{ marginLeft: "1rem" }}
        >
          Download PDF
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
