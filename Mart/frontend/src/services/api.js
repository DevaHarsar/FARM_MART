import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Helper to include token
// const authHeader = () => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
// }); 
const authHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};


// export const getProductById = (id) => {
//   return axios.get(`${API_URL}/products/${id}`, authHeader())
//     .then(response => {
//       if (!response.data) {
//         throw new Error("Product not found");
//       }
//       return response.data;
//     })
//     .catch(error => {
//       throw error;
//     });
// };

export const getProductById = (id) => {
  return axios.get(`${API_URL}/products/${id}`, authHeader())
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updateFarmerProfile = (data) => {
  return axios.put(`${API_URL}/farmers/profile`, data, authHeader());
};

export const getFarmerProfile = () => {
  return axios.get(`${API_URL}/farmers/profile`, authHeader());
};
export const getRelatedProducts = async (id) => {
  return axios.get(`${API_URL}/products/${id}`, authHeader())
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getReviews = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}/reviews`, authHeader());
    return response.data;
  } catch (err) {
    console.error(err);
  }
};


export const addReview = async (id, review) => {
  try {
    const response = await axios.post(`/products/${id}/reviews`, review);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};


export const login = (data) => axios.post(`${API_URL}/auth/login`, data);
export const signup = (data) => axios.post(`${API_URL}/auth/signup`, data);
export const addProduct = (data) => axios.post(`${API_URL}/products/add`, data, authHeader());
export const getFarmerProducts = () => axios.get(`${API_URL}/products/my-products`, authHeader());
export const getAllProducts = () => axios.get(`${API_URL}/products/all`);
export const updateProduct = (id, data) => axios.put(`${API_URL}/products/${id}`, data, authHeader());
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`, authHeader());
