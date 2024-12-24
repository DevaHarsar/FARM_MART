import axios from "axios";
const API_URL = "http://localhost:5000/api";

// Helper to include token
// const authHeader = () => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
// });
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

export const paymentprocess = (amount) => {
  return axios.post(
    `${API_URL}/payment/create-order`,
    { amount: amount },
    authHeader()
  );
};

export const verifyPayment = (response) => {
  return axios.post(`${API_URL}/payment/verify-order`, response, authHeader());
};

export const getProductById = (id) => {
  return axios
    .get(`${API_URL}/products/${id}`, authHeader())
    .then((response) => response.data)
    .catch((error) => {
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
  return axios
    .get(`${API_URL}/products/related/${id}`, authHeader())
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const getReviews = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/products/${id}/reviews`,
      authHeader()
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const addReview = async (id, review) => {
  try {
    const response = await axios.post(
      `${API_URL}/products/${id}/reviews`,
      review,
      authHeader()
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
export const addToCartApi = async (product) => {
  const token = localStorage.getItem("token"); // Assuming you store JWT tokens in localStorage
  try {
    const response = await axios.post(
      "/api/cart/add", // Backend endpoint
      {
        productId: product._id,
        quantity: 1, // Default quantity
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token for authentication
        },
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error(
      "Error adding product to cart:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getCartItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart`, authHeader());
    console.log(response);
    return response.data;
  } catch (err) {
    console.error(
      "Error fetching cart items:",
      err.response?.data || err.message
    );
    throw err;
  }
};
export const removeItemFromCart = async (itemId) => {
  try {
    console.log("Item ID:", itemId); // Log itemId to verify it's passed correctly
    const del = await axios.delete(`${API_URL}/cart/${itemId}`, authHeader());
    console.log("Delete response:", del);
  } catch (err) {
    console.error(
      "Error removing item from cart:",
      err.response?.data || err.message
    );
    throw err;
  }
};
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);
export const signup = (data) => axios.post(`${API_URL}/auth/signup`, data);
export const addProduct = (data) =>
  axios.post(`${API_URL}/products/add`, data, authHeader());
export const getFarmerProducts = () =>
  axios.get(`${API_URL}/products/my-products`, authHeader());
export const getAllProducts = () => axios.get(`${API_URL}/products/all`);
export const updateProduct = (id, data) =>
  axios.put(`${API_URL}/products/${id}`, data, authHeader());
export const deleteProduct = (id) =>
  axios.delete(`${API_URL}/products/${id}`, authHeader());
export const getFarmerDetails = (id) =>
  axios.get(`${API_URL}/products/farmer-username/${id}`, authHeader());
