import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch to dispatch actions
import { login } from "../../state/AuthSlice"; // Import the login action
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const userData = response.data; // Assuming the response contains user data
      const role = userData.role;

      // Check for role validity before proceeding
      if (role !== "farmer" && role !== "buyer") {
        throw new Error("Invalid role returned from the server");
      }

      alert("Login successful");

      // Dispatch login action to update the user in the Redux store
      dispatch(login(userData));

      // Navigate to the appropriate dashboard based on the role
      navigate(role === "farmer" ? "/farmer-dashboard" : "/product-list");
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-500 transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Login = ({ onLogin }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/api/auth/login", { email, password });
//       const role = response.data.role; // Ensure your backend returns the role

//       // Check for role validity before proceeding
//       if (role !== "farmer" && role !== "buyer") {
//         throw new Error("Invalid role returned from the server");
//       }

//       alert("Login successful");
//       onLogin(role); // Pass the role to the parent component
//       navigate(role === "farmer" ? "/farmer-dashboard" : "/product-list"); // Redirect based on role
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Login failed. Please check your credentials.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-80"
//       >
//         <h2 className="text-2xl font-bold mb-4">Login</h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full mb-4 p-2 border border-gray-300 rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 p-2 border border-gray-300 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-500 transition duration-300"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
