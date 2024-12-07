import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api'; // Assuming login is a service function for API call
import '../Auth/auth.css'; // Assuming you have a separate CSS file for styling
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for redirecting after login
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role && window.location.pathname === '/login') {
      onLogin(role);
      if (role === 'farmer') {
        navigate('/farmer-dashboard');
      } else {
        navigate('/product-list');
      }
    }
  }, [navigate, onLogin]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      const { token, role, name } = response.data;

      // Save token and role in localStorage to persist session
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);

      // Call onLogin to update parent state
      onLogin(role);

      // Redirect to the appropriate dashboard based on role
      if (role === 'farmer') {
        navigate('/farmer-dashboard');
      } else {
        navigate('/product-list');
      }
    } catch (err) {
      console.error(err); // Add logging to catch specific errors
      setError('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="form-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p className="redirect-text">

          Don't have an account?
          <Link to="/signup" className="mx-2">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
