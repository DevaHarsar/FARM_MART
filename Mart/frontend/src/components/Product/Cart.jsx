import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getProductById } from "../../services/api";
import OrderPage from "./OrderPage";

// Helper function for Authorization header
const authHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  // Fetch cart items and resolve product details
  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get(`http://localhost:5000/api/cart`, authHeader());
        const cart = response.data.cart; // Assuming the cart data is inside the 'cart' field of the response


        // Fetch product details and resolve the cart items
        const itemsWithDetails = await Promise.all(
          cart.map(async (item) => {

            try {
              // Make sure to pass the productId to the getProductById function
              const productResponse = await getProductById(item.product);  // Pass productId directly

              return {
                ...item,
                product: productResponse, // Attach product details to the item
              };
            } catch (err) {
              console.warn(`Product with ID ${item.product} not found.`);
              return null; // Return null for missing products
            }
          })
        );
        

        // Filter out any null values (missing products)
        const validItems = itemsWithDetails.filter((item) => item !== null);
        setCartItems(validItems);
        
        calculateTotal(validItems);
      } catch (err) {
        // setError(err.response?.data?.message || "Failed to fetch cart items.");
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchCartItems();
  }, []);

  // Calculate total price for all items in the cart
  const calculateTotal = (items) => {
    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  // Handle quantity change
  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
   
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${itemId}`,
        { quantity },
        authHeader()
      );

      const updatedCart = cartItems.map((item) =>
        item.product._id === itemId ? { ...item, quantity } : item
      );
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quantity.");
    }
  };

  // Handle removing an item
  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, authHeader());
      const updatedCart = cartItems.filter((item) => item.product._id !== itemId);
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
      alert("Item removed from cart.");
    } catch (err) {
      setError("Failed to remove item from cart.");
    }
  };

  // Handle navigating to payment page
  const handleProceedToPayment = () => navigate("/Orderpage");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : cartItems.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              className="flex justify-between items-center border-b py-4"
            >
              <div className="flex items-center w-1/2">
                <img
                  src={item.product?.image || "default.jpg"}
                  alt={item.product?.name || "Deleted Product"}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold">
                    {item.product?.name || "Product Removed"}
                  </h3>
                  {item.product ? (
                    <p className="text-gray-600">
                      ₹{item.price} {item.weight}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm italic">No longer available</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                {item.product && (
                  <>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, item.quantity - 1)

                      }
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.product, parseInt(e.target.value, 10))
                      }
                      className="mx-2 w-12 text-center border rounded"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, item.quantity + 1)
                      }
                      className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </>
                )}
              </div>

              <p className="w-1/6 text-right text-lg font-semibold">
                {item.product ? `₹${item.price * item.quantity}` : "N/A"}
              </p>

              <button
                onClick={() => handleRemoveItem(item.product._id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Grand Total: ₹{total}</h2>
            <button
              onClick={handleProceedToPayment}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              PLACE AN ORDER
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
