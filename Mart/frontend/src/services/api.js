// Helper to include token
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Improved code for payment process
export const paymentProcess = async (amount) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/create-order`,
      { amount },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};

// Improved code for verify payment
export const verifyPayment = async (response) => {
  try {
    const result = await axios.post(
      `${API_URL}/payment/verify-order`,
      response,
      authHeader()
    );
    return result.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

// Improved code for get product by id
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error getting product by id:", error);
    throw error;
  }
};

// Improved code for update farmer profile
export const updateFarmerProfile = async (data) => {
  try {
    const response = await axios.put(`${API_URL}/farmers/profile`, data, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error updating farmer profile:", error);
    throw error;
  }
};

// Improved code for get farmer profile
export const getFarmerProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/farmers/profile`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error getting farmer profile:", error);
    throw error;
  }
};

// Improved code for get related products
export const getRelatedProducts = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/related/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error getting related products:", error);
    throw error;
  }
};

// Improved code for get reviews
export const getReviews = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}/reviews`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error getting reviews:", error);
    throw error;
  }
};

// Improved code for add review
export const addReview = async (id, review) => {
  try {
    const response = await axios.post(`${API_URL}/products/${id}/reviews`, review, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// Improved code for add to cart
export const addToCartApi = async (product) => {
  try {
    const response = await axios.post(
      `${API_URL}/cart/add`,
      {
        productId: product._id,
        quantity: 1,
      },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Improved code for get cart items
export const getCartItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error getting cart items:", error);
    throw error;
  }
};

// Improved code for remove item from cart
export const removeItemFromCart = async (itemId) => {
  try {
    const response = await axios.delete(`${API_URL}/cart/${itemId}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
};

// Improved code for login
export const login = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Improved code for signup
export const signup = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, data);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Improved code for add product
export const addProduct = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/products/add`, data, authHeader());
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw errorrom "axios";
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
