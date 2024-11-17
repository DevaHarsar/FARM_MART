import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={!!user} // Check if user exists
        isFarmer={isFarmer}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/farmer-dashboard"
          element={isFarmer ? <FarmerDashboard /> : <Home />}
        />
        <Route
          path="/product-list"
          element={user ? <ProductList /> : <Home />}
        />
        <Route
          path="/view-product/:productId"
          element={user ? <ViewProduct /> : <Home />}
        />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

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
