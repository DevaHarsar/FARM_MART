import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const fetchProducts = () => api.get('/products');
export const addProduct = (data, token) => api.post('/products', data, {
  headers: { Authorization: `Bearer ${token}` },
});
