import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const PROJECT_ID = import.meta.env.VITE_NOVI_PROJECT_ID;

  // Create a stable axios instance using useMemo or defined outside
  const noviApi = React.useMemo(() => {
    const instance = axios.create({
      baseURL: 'https://novi-backend-api-wgsgz.ondigitalocean.app/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add a request interceptor to inject the Project ID and Token dynamically
    instance.interceptors.request.use((config) => {
      config.headers['novi-education-project-id'] = PROJECT_ID;
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [PROJECT_ID]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      let response;
      // Try both formats as the API varies
      try {
        response = await noviApi.post('/login', { username: email, password });
      } catch (err) {
        response = await noviApi.post('/login', { email, password });
      }

      const { token, id, email: userEmail, username: name } = response.data;
      const userData = { id, email: userEmail, username: name };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error details:', error.response?.data);
      return { success: false, message: error.response?.data?.message || 'Login failed - Check credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (username, email, password) => {
    try {
      await noviApi.post('/users', {
        username,
        email,
        password,
        roles: ['gebruiker']
      });
      return { success: true };
    } catch (error) {
      console.error('Registration error details:', error.response?.data);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, noviApi }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
