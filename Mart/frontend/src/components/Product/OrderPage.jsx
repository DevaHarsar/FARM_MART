import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { paymentprocess, verifyPayment } from "../../services/api";

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [farmerIds, setFarmerIds] = useState([]); 
  const [onlinePaymentStatus, setOnlinePaymentStatus] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You need to log in first.");
          return;
        }
        const response = await axios.get("/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const items = response.data.cart;
        const userResponse = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = userResponse.data;
        setUserId(user.userId);
        const updatedItems = await Promise.all(
          items.map(async (item) => {
            const productResponse = await axios.get(`/api/products/${item.product}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const product = productResponse.data;
            const farmerResponse = await axios.get(`/api/products/farmer-username/${product.farmerId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const farmer = farmerResponse.data;
            setFarmerIds((prevFarmerIds) =>
              prevFarmerIds.includes(product.farmerId)
                ? prevFarmerIds
                : [...prevFarmerIds, product.farmerId]
            );
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
        const calculatedTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        setTotalAmount(calculatedTotal);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Error fetching cart items.");
        console.error("Error fetching cart items:", error.message);
      }
    };
    fetchCartItems();
  }, []);

  const initPayment = async (data) => {
    return new Promise((resolve, reject) => {
      if (onlinePaymentStatus !== 1) {
        const options = {
          key: "rzp_test_atN4rCBAMPCIXB", 
          amount: data.amount, 
          currency: data.currency,
          name: "Farm Mart", 
          description: "Test Transaction",
          order_id: data.id, 
          handler: async (response) => {
            try {
              const result = await verifyPayment(response);
              if (result.status === 200) {
                alert("Payment Successful!");
                setOnlinePaymentStatus(1); 
                resolve(); 
              } else {
                alert("Payment Verification Failed!");
                console.log("Payment verification failed");
                reject();
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              alert("Error verifying payment. Please contact support.");
              reject();
            }
          },
          prefill: {
            name: name, 
            email: email, 
            contact: phoneNumber, 
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
          console.error("Payment failed:", response.error);
          alert("Payment failed. Please try again.");
          reject();
        });
        rzp.open();
      }
    });
  };

  const handleOrder = async () => {
    if (!name || !address || !phoneNumber || !email) {
      alert("Please provide all the required details.");
      return;
    }

    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }

    const productsByFarmer = cartItems.reduce((group, item) => {
      const farmerId = item.product.farmerId; 
      if (!group[farmerId]) {
        group[farmerId] = [];
      }
      group[farmerId].push({
        productId: item.product._id,
        quantity: item.quantity,
        weight: item.weight,
        price: item.price,
        total: item.total,
        farmerId: farmerId,
      });
      return group;
    }, {});
    const orders = Object.keys(productsByFarmer).map((farmerId) => ({
      userId,
      farmerId,
      name,
      products: productsByFarmer[farmerId],
      totalAmount: productsByFarmer[farmerId].reduce((sum, product) => sum + product.total, 0),
      paymentMethod,
      deliveryAddress: address,
      phoneNumber,
      email,
    }));

    try {
      const token = localStorage.getItem("token");
      if (paymentMethod === "Online") {
        const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const { data } = await paymentprocess(totalAmount);
        await initPayment(data.data);
        console.log("Payment completed after");
        const response = await axios.post("/api/orders/create", orders, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Order placed successfully!");
        navigate("/orders");
      } else if (paymentMethod === "COD") {
        const response = await axios.post("/api/orders/create", orders, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Order placed successfully!");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error placing order:", error);
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
            <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-md" />
            <div className="flex-1 pl-4">
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-gray-600">{item.product.description}</p>
              <p className="text-gray-600">Sold by: {item.product.farmerName}</p>
            </div>
            <div className="text-right">
              <p>{item.quantity} x ₹{item.price}</p>
              <p className="font-bold">₹{item.total}</p>
            </div>
          </div>
        ))}
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
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Phone Number</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
        </div>
      </div>
      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">Select Payment Method
        </h2>
    <div>
      <label>
        <input type="radio" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="mr-2" /> Cash on Delivery
      </label>
    </div>
    <div>
      <label>
        <input type="radio" value="Online" checked={paymentMethod === "Online"} onChange={() => setPaymentMethod("Online")} className="mr-2" /> Online Payment (Razorpay)
      </label>
    </div>
  </div>
  <div className="flex justify-center mb-4">
    <button onClick={handleOrder} className="bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:bg-blue-600 transition"> Place Order </button>
  </div>
</div>

);
};

export default OrderPage;

