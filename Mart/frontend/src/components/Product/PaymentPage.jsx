import React, { useState } from "react";
import QRCode from "react-qr-code";
import { paymentprocess } from "../../services/api";

const PaymentPage = ({ totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = async () => {
    if (paymentMethod === "Online") {
      // Simulate online payment success
      const { data } = await paymentprocess();
      setIsPaid(true);
      alert("Payment Successful!");
    } else {
      // Handle Cash on Delivery case
      alert("Order placed with Cash on Delivery!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Payment Page</h1>

      {/* Total Amount */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">Total Amount</h2>
        <p className="text-2xl font-bold mt-2">₹{totalAmount}</p>
      </div>

      {/* Payment Method Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">Select Payment Method</h2>
        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="cod" className="text-gray-600">
            Cash on Delivery
          </label>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="online"
            name="paymentMethod"
            value="Online"
            checked={paymentMethod === "Online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="online" className="text-gray-600">
            Online Payment
          </label>
        </div>

        {/* QR Code for Online Payment */}
        {paymentMethod === "Online" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Scan to Pay</h2>
            <QRCode value={`pay:${totalAmount}`} size={256} />
          </div>
        )}
      </div>

      {/* Confirm Payment Button */}
      <button
        onClick={handlePayment}
        className={`mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600`}
      >
        {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentPage;
