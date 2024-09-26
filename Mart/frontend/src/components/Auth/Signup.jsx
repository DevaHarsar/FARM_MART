// src/components/Auth/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/signup', { email, password, role });
      alert('Signup successful');
      // Optionally redirect or update UI after successful signup
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed');
    }
  };

  return (
    <>
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
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
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Signup</button>
      </form>
    </div>
    </>
  );
};

export default Signup;
