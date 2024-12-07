import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();  // Get the order ID from the URL parameter
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details from the API
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await axios.get(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data.order); // Set the fetched order data into state
      } catch (error) {
        setError('Failed to fetch order details.');
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false); // Stop loading once the request completes
      }
    };

    fetchOrder();
  }, [id]);  // Run the effect again when the order ID changes

  // Display loading or error state
  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  // If no order data is found, display a message
  if (!order) {
    return <div className="text-center text-lg">No order found.</div>;
  }

  // Calculate the progress based on the status
  const getOrderProgress = () => {
    switch (order.status) {
      case 'Processing':
        return 30;
      case 'Shipped':
        return 70;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Your Order Details</h2>

      {/* Order Information */}
      <div className="space-y-4 mb-8">
        <ul className="text-lg">
          <li><strong>Order ID:</strong> {order._id}</li>
          <li><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</li>
          <li><strong>Status:</strong>
            <span className={`font-semibold ${order.status === 'Delivered' ? 'text-green-500' : order.status === 'Shipped' ? 'text-blue-500' : 'text-yellow-500'}`}>
              {order.status}
            </span>
          </li>
        </ul>
      </div>

      {/* Order Progress */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Order Progress</h3>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Processing</span>
          <span className="text-sm text-gray-600">Shipped</span>
          <span className="text-sm text-gray-600">Delivered</span>
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-sm font-medium">Order Progress</span>
            </div>
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                {order.status}
              </span>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-teal-600 h-2.5 rounded-full"
                style={{ width: `${getOrderProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Products</h3>
        <div className="space-y-4">
          {order.products.map((product, index) => (
            <div key={index} className="flex items-center border p-4 rounded-lg shadow-sm">
              {/* Product details on the left */}
              <div className="flex-1 mr-4">
                <h4 className="text-lg font-semibold">{product.productId.name}</h4>
                <p><strong>Quantity:</strong> {product.quantity} kg</p>
                <p><strong>Weight:</strong> {product.weight}</p>
                <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
                <p><strong>Total:</strong> ₹{product.total.toFixed(2)}</p>
              </div>

              {/* Product image on the right */}
              <div className="w-32 h-32">
                <img
                  src={product.productId.image}
                  alt={product.productId.name}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold">Additional Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
          <div><strong>Shipping Address:</strong> {order.deliveryAddress}</div>
          <div><strong>Phone Number:</strong> {order.phoneNumber}</div>
          <div><strong>Email:</strong> {order.email}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
