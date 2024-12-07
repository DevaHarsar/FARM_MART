// components/Auth/Signup.jsx
import React, { useState } from 'react';
import { signup } from '../../services/api';
import '../Auth/auth.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // Default role
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      alert('Signup successful');
      setTimeout(() => {
        navigate("/login");
      }, 500);

    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="form-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="username" placeholder="Username" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Email" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <select name="role" className="form-input" onChange={handleChange} required>

              <option value="user">User</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Sign Up</button>

        </form>
        <div className="auth-link">

          <p className="redirect-text">
            Already have an account?
            <Link to="/login" className="mx-2">Login</Link>
          </p>
        </div>
      </div>
    </div>

  );
}

export default Signup;
