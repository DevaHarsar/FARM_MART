import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
      } catch (err) {
        // setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 mt-10 text-lg">{error}</div>;

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-xl">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <h2 className="font-semibold text-xl mb-2 text-gray-800">Order ID: {order._id}</h2>
              <p className="text-gray-700 mb-2"><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              <p className="text-gray-700 mb-2"><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p className="text-gray-700 mb-4"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700 transition-colors"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
