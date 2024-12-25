import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import FarmerDashboard from "./components/FarmerDashboard";
import ProductList from "./components/Product/ProductList";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import ViewProduct from "./components/Product/ViewProduct";
import Cart from "./components/Product/Cart";
import PaymentPage from "./components/Product/PaymentPage";
import OrderPage from "./components/Product/OrderPage";
import OrderList from "./components/Product/OrderList";
import OrderDetails from "./components/Product/OrderDetails";
import FarmerOrders from "./components/Product/FarmerOrders";
function App() {
  // Initialize state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "false"
  );
  const [isFarmer, setIsFarmer] = useState(
    localStorage.getItem("isFarmer") === "false"
  );
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    // Update localStorage whenever cart changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (role, username) => {
    setIsLoggedIn(true);
    setIsFarmer(role === "farmer");
    setUsername(username);
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("isFarmer", role === "farmer");
    localStorage.setItem("username", username);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsFarmer(false);
    setUsername("");
    setCart([]); // Clear cart on logout
  };

  const handleAddToCart = (product) => {
    const updatedCart = [...cart];
    const existingProduct = updatedCart.find(
      (item) => item._id === product._id
    );
    if (existingProduct) {
      existingProduct.quantity += 1; // Increment quantity if already in cart
    } else {
      updatedCart.push({ ...product, quantity: 1 }); // Add new product with quantity 1
    }
    setCart(updatedCart);
    alert("Product added to cart!");
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return; // Don't allow negative quantities
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        isFarmer={isFarmer}
        username={username}
        onLogout={handleLogout}
        cartLength={cart.length} // Pass cart length to Navbar
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={isFarmer ? "/farmer-dashboard" : "/product-list"} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Protected Routes for Farmers */}
        <Route
          path="/farmer-dashboard"
          element={
            isLoggedIn && isFarmer ? (
              <FarmerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Protected Routes for Authenticated Users */}
        <Route
          path="/product-list"
          element={
            isLoggedIn && !isFarmer ? <ProductList /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/product/:id"
          element={
            isLoggedIn ? (
              <ViewProduct addToCart={handleAddToCart} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/cart"
          element={
            isLoggedIn ? (
              <Cart
                cart={cart}
                setCart={setCart}
                handleQuantityChange={handleQuantityChange}
                handleRemoveItem={handleRemoveItem}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/payment"
          element={
            isLoggedIn ? <PaymentPage cart={cart} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/Orderpage"
          element={
            isLoggedIn ? <OrderPage cart={cart} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/orders"
          element={isLoggedIn ? <OrderList /> : <Navigate to="/login" />}
        />

        {/* Route for Order Details */}
        <Route
          path="/orders/:id"
          element={isLoggedIn ? <OrderDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/orders/farmer-orders"
          element={isLoggedIn ? <FarmerOrders /> : <Navigate to="/login" />}
        />
        {/* Redirect all unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
