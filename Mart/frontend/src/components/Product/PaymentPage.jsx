import React, { useState } from "react";
import QRCode from "react-qr-code"; // QR Code generation library

const PaymentPage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [total, setTotal] = useState(500); // This can be dynamically passed from cart context
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handleNameChange = (e) => setName(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  const handlePayment = () => {
    if (!name || !address) {
      alert("Please provide both name and address.");
      return;
    }

    alert("Payment Successful!");
    // You can add additional payment API calls here if required
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Payment Page</h1>

      {/* User Details Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">Enter Delivery Details</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Address</label>
            <textarea
              value={address}
              onChange={handleAddressChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your address"
            />
          </div>
        </form>
      </div>

      {/* QR Code for payment */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">Pay with QR Code</h2>
        <QRCode value={`pay:${total}`} size={256} />
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">Select Payment Method</h2>
        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={handlePaymentMethodChange}
            className="mr-2"
          />
          <label htmlFor="cod" className="text-gray-600">Cash on Delivery</label>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="online"
            name="paymentMethod"
            value="Online"
            checked={paymentMethod === "Online"}
            onChange={handlePaymentMethodChange}
            className="mr-2"
          />
          <label htmlFor="online" className="text-gray-600">Online Payment</label>
        </div>
      </div>

      {/* Payment Confirmation */}
      <div className="text-right">
        <button
          onClick={handlePayment}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
