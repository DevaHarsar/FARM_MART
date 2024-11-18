import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./state/AuthSlice"; // Import logout action
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import FarmerDashboard from "./components/FarmerDashboard";
import ProductList from "./components/Product/ProductList";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import ViewProduct from "./components/Product/ViewProduct";

function App() {
  // Access Redux state
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // Determine if the logged-in user is a farmer
  const isFarmer = user?.role === "farmer";

  // Handle logout
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
  };

  // Redirect unauthenticated users to login
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Redirect based on role for specific routes
  const RoleBasedRoute = ({ isAllowed, fallback, children }) => {
    return isAllowed ? children : <Navigate to={fallback} />;
  };

  useEffect(() => {
    // Check and set user from localStorage on app load
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      // Sync Redux state if user exists in localStorage
      dispatch({ type: "auth/login", payload: storedUser });
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar
        isLoggedIn={!!user} // Check if user exists
        isFarmer={isFarmer}
        onLogout={handleLogout}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute isAllowed={isFarmer} fallback="/">
                <FarmerDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/product-list"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-product/:productId"
          element={
            <ProtectedRoute>
              <ViewProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "./state/AuthSlice"; // Import logout action
// import Login from "./components/Auth/Login";
// import Signup from "./components/Auth/Signup";
// import FarmerDashboard from "./components/FarmerDashboard";
// import ProductList from "./components/Product/ProductList";
// import Home from "./components/Home";
// import Navbar from "./components/Navbar";
// import ViewProduct from "./components/Product/ViewProduct";

// function App() {
//   // Access Redux state
//   const user = useSelector((state) => state.auth.user);
//   const dispatch = useDispatch();

//   // Determine if the logged-in user is a farmer
//   const isFarmer = user?.role === "farmer";

//   const handleLogout = () => {
//     dispatch(logout()); // Dispatch logout action
//   };

//   return (
//     <Router>
//       <Navbar
//         isLoggedIn={!!user} // Check if user exists
//         isFarmer={isFarmer}
//         onLogout={handleLogout}
//       />
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/farmer-dashboard"
//           element={isFarmer ? <FarmerDashboard /> : <Home />}
//         />
//         <Route
//           path="/product-list"
//           element={user ? <ProductList /> : <Home />}
//         />
//         <Route
//           path="/view-product/:productId"
//           element={user ? <ViewProduct /> : <Home />}
//         />
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// // src/App.jsx
// import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "./components/Auth/Login";
// import Signup from "./components/Auth/Signup";
// import FarmerDashboard from "./components/FarmerDashboard";
// import ProductList from "./components/Product/ProductList";
// import Home from "./components/Home";
// import Navbar from "./components/Navbar";
// import ViewProduct from "./components/Product/ViewProduct";

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isFarmer, setIsFarmer] = useState(false);

//   const handleLogin = (role) => {
//     setIsLoggedIn(true);
//     setIsFarmer(role === "farmer");
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setIsFarmer(false);
//   };

//   return (
//     <Router>
//       <Navbar
//         isLoggedIn={isLoggedIn}
//         isFarmer={isFarmer}
//         onLogout={handleLogout}
//       />
//       <Routes>
//         <Route path="/login" element={<Login onLogin={handleLogin} />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/farmer-dashboard"
//           element={isFarmer ? <FarmerDashboard /> : <Home />}
//         />
//         <Route
//           path="/product-list"
//           element={isLoggedIn ? <ProductList /> : <Home />}
//         />
//         <Route
//           path="/view-product/:productId"
//           element={isLoggedIn ? <ViewProduct /> : <Home />}
//         />
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
