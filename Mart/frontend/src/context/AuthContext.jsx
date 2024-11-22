
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check for user data in localStorage on app load
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(storedUser); // Use stored user data if available

  useEffect(() => {
    // Sync user state with localStorage whenever user changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
    } else {
      localStorage.removeItem('user'); // Clear user data if logged out
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData); // Store user data when logging in
  };

  const logout = () => {
    setUser(null);
  };
  
  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
