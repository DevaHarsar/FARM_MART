import React, { useState, useEffect } from "react";
import axios from "axios";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({}); // Store fetched product details
  const [visibleOrders, setVisibleOrders] = useState(6); // Initially show 6 orders

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/orders/farmer-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ordersData = response.data;
        setOrders(ordersData);

        // Fetch product details for all products in the orders
        const productDetails = await Promise.all(
          ordersData.flatMap((order) =>
            order.products.map(async (product) => {
              const prod = await axios.get(`/api/products/${product.productId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return { productId: product.productId, product: prod.data };
            })
          )
        );

        // Create a map for product details using productId
        const productMap = {};
        productDetails.forEach(({ productId, product }) => {
          productMap[productId] = product;
        });

        setProducts(productMap); // Store product details in state
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/orders/update-status/${orderId}`,
        { status }, // Pass status in the request body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the order status in the state directly after a successful API call
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status } // Update the status dynamically
            : order
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status.");
    }
  };

  const handleShowMore = () => {
    setVisibleOrders((prev) => prev + 6); // Show 6 more orders on "Show More" click
  };

  if (loading) return <div className="text-center mt-10">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  // Sort orders by creation date (latest first)
  const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Farmer Dashboard</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOrders.slice(0, visibleOrders).map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-lg bg-white"
            >
              <h2 className="font-bold text-xl mb-2 text-gray-800">
                Order ID: {order._id}
              </h2>
              <p className="text-gray-700 mb-1">
                <strong>Customer Name:</strong> {order.name}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Status:</strong> {order.status}
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Delivery Address:</strong> {order.deliveryAddress}
              </p>

              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Ordered Products:
              </h3>
              {order.products.map((product, index) => {
                const productDetails = products[product.productId];

                return (
                  <div
                    key={index}
                    className="flex items-center border-b py-2 gap-4"
                  >
                    {productDetails ? (
                      <>
                        {/* Product Image */}
                        <img
                          src={productDetails.image}
                          alt={productDetails.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-800">
                            {productDetails.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {product.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Weight: {product.weight}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: ₹{product.price}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p>Loading product details...</p>
                    )}
                  </div>
                );
              })}

              {/* Status Update Dropdown */}
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="mt-4 w-full p-2 border rounded-md text-green-700 bg-white"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
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

export default FarmerOrders;
