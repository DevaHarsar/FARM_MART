import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../../state/AuthSlice";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/signup", {
        email,
        password,
        role,
      });
      const userData = response.data;

      alert("Signup successful");
      dispatch(login(userData)); // Save user data to Redux and localStorage
      navigate(role === "farmer" ? "/farmer-dashboard" : "/product-list");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="w-full mb-4 p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="buyer">Buyer</option>
          <option value="farmer">Farmer</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;

// import React, { useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux"; // Import useDispatch to dispatch actions
// import { login } from "../../state/AuthSlice"; // Import the login action
// import { useNavigate } from "react-router-dom";

// const Signup = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("buyer");
//   const dispatch = useDispatch(); // Initialize dispatch
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/api/auth/signup", {
//         email,
//         password,
//         role,
//       });
//       alert("Signup successful");

//       // Assuming the response contains user data, including role
//       const userData = response.data;

//       // Dispatch login action to update the user in the Redux store
//       dispatch(login(userData));

//       // Redirect to the appropriate dashboard after signup
//       navigate(role === "farmer" ? "/farmer-dashboard" : "/product-list");
//     } catch (error) {
//       console.error("Signup error:", error);
//       alert("Signup failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-80"
//       >
//         <h2 className="text-2xl font-bold mb-4">Signup</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full mb-4 p-2 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 p-2 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <select
//           className="w-full mb-4 p-2 border rounded"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="buyer">Buyer</option>
//           <option value="farmer">Farmer</option>
//         </select>
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white p-2 rounded"
//         >
//           Signup
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;

// // src/components/Auth/Signup.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import Navbar from '../Navbar';

// const Signup = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('buyer');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/auth/signup', { email, password, role });
//       alert('Signup successful');
//       // Optionally redirect or update UI after successful signup
//     } catch (error) {
//       console.error('Signup error:', error);
//       alert('Signup failed');
//     }
//   };

//   return (
//     <>
//     <div className="flex items-center justify-center h-screen">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
//         <h2 className="text-2xl font-bold mb-4">Signup</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full mb-4 p-2 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 p-2 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <select
//           className="w-full mb-4 p-2 border rounded"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="buyer">Buyer</option>
//           <option value="farmer">Farmer</option>
//         </select>
//         <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Signup</button>
//       </form>
//     </div>
//     </>
//   );
// };

// export default Signup;
