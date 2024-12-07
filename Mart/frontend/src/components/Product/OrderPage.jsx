import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const OrderPage = ({ farmersId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number
  const [email, setEmail] = useState(""); // New state for email
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null); // To store the userId from the Users database
  const [farmerId, setfarmerId] = useState(null);
  const navigate = useNavigate();
  // Fetch cart items and user details on mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("You need to log in first.");
          return;
        }

        // Fetch cart items
        const response = await axios.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = response.data.cart;
        console.log(items);

        // Fetch the userId from the Users database
        const userResponse = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = userResponse.data;
        console.log(user)
        setUserId(user.userId); // Set userId from the Users database
        console.log(user.userId)

        // Fetch additional product details including farmer information
        const updatedItems = await Promise.all(
          items.map(async (item) => {
            // Fetch product details using the token for authorization
            const productResponse = await axios.get(`/api/products/${item.product}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const product = productResponse.data;

            // Fetch farmer details using the farmerId from the product
            const farmerResponse = await axios.get(`/api/products/farmer-username/${product.farmerId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const farmer = farmerResponse.data;
            setfarmerId(product.farmerId);
            // Update item with additional product and farmer details
            return {
              ...item,
              product: {
                ...product,
                farmerName: farmer.username,
              },
            };
          })
        );

        setCartItems(updatedItems);

        // Calculate total amount
        const calculatedTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        setTotalAmount(calculatedTotal);

      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Error fetching cart items.");
        console.error("Error fetching cart items:", error.message);
      }
    };

    fetchCartItems();
  }, []);

  // Handle placing an order
  const handleOrder = async () => {
    if (!name || !address || !phoneNumber || !email) {
      alert("Please provide all the required details.");
      return;
    }

    // If userId is not fetched, alert the user
    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }

    const orderData = {
      userId,  // Use the userId fetched from the Users database
      farmerId,
      name,
      products: cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        weight: item.weight,
        price: item.price,
        total: item.total,
      })),
      totalAmount,
      paymentMethod,
      deliveryAddress: address,
      phoneNumber, // Add phone number
      email, // Add email
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/orders/create", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order placed successfully!");
      navigate("/orders");
      console.log(response.data);
    } catch (error) {
      alert("Error placing order: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Review and Place Your Order</h1>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b py-4">
            {/* Product Image */}
            <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-md" />
            {/* Product Name */}
            <div className="flex-1 pl-4">
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-gray-600">{item.product.description}</p>
              <p className="text-gray-600">Sold by: {item.product.farmerName}</p>
            </div>
            {/* Quantity and Price */}
            <div className="text-right">
              <p>{item.quantity} x ₹{item.price}</p>
              <p className="font-bold">₹{item.total}</p>
            </div>
          </div>
        ))}

        {/* Total Amount */}
        <div className="flex justify-between font-bold mt-4">
          <p>Total Amount:</p>
          <p>₹{totalAmount}</p>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">Enter Delivery Details</h2>
        <div className="mb-4">
          <label className="block text-gray-600">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">Select Payment Method</h2>
        <div>
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="cod" className="ml-2">Cash on Delivery</label>
        </div>
        <div>
          <input
            type="radio"
            id="online"
            name="paymentMethod"
            value="Online"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="online" className="ml-2">Online Payment</label>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handleOrder}
        className="bg-blue-600 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderPage;
