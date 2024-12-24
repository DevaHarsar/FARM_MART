import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleOrders, setVisibleOrders] = useState(3); // Limit initial visible orders
  const [productImages, setProductImages] = useState({}); // Cache product images by productId
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
        fetchProductImages(response.data.orders); // Fetch product images when orders are loaded
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch the product images for all productIds
  const fetchProductImages = async (orders) => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    const productIds = orders.flatMap(order => order.products.map(product => product.productId));
    const uniqueProductIds = [...new Set(productIds)]; // Remove duplicates
  
    const productImagesData = {};
    for (const productId of uniqueProductIds) {
      try {
        // Include the token in the headers
        const response = await axios.get(`/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        productImagesData[productId] = response.data.image; // Assuming response contains image URL
      } catch (err) {
        console.error(`Error fetching product image for ${productId}:`, err);
      }
    }
    setProductImages(productImagesData);
  };

  const handleShowMore = () => {
    setVisibleOrders((prev) => prev + 3); // Load 3 more orders
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 mt-10 text-lg">{error}</div>;

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-xl">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.slice(0, visibleOrders).map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <h2 className="font-semibold text-xl mb-2 text-gray-800">Order ID: {order._id}</h2>
              <div className="flex mb-4">
                {/* Display the image of the first product */}
                {order.products && order.products.length > 0 && (
                  <img
                    src={productImages[order.products[0].productId] || "default-image-url.jpg"}
                    alt={order.products[0].productId}
                    className="w-16 h-16 object-cover mr-2 rounded-md"
                  />
                )}
              </div>
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

      {/* Show More Button */}
      {orders.length > visibleOrders && (
        <div className="text-center mt-6">
          <button
            onClick={handleShowMore}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
