import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getRelatedProducts, getReviews } from "../../services/api";
import "../Product/product.css";
import defaultProfile from "../img/pic1.jpg";
import axios from "axios";

const API_URL = 'http://localhost:5000/api';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
    name: "",
  });

  // Fetch product details, related products, and reviews
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const response = await getRelatedProducts(id);
        setRelatedProducts(response);
      } catch (err) {
        setError("Failed to load related products");
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await getReviews(id);
        // Ensure reviews is always an array
        setReviews(Array.isArray(response) ? response : []);
      } catch (err) {
        setError("Failed to load reviews");
        
      }
    };

    fetchProduct();
    fetchRelatedProducts();
    fetchReviews();
  }, [id]);

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Please log in.");
      }

      const response = await axios.post(
        `${API_URL}/cart/add`,
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Product added to cart successfully:", response.data);
      alert("Product added to Cart Successfully");
      navigate("/cart");
    } catch (err) {
      console.error("Failed to add product to cart", err.response?.data || err.message);
      alert("Failed to add product to cart");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!product._id || !review.rating || review.comment.trim() === "") {
      setError("Product or review data is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/products/${id}/reviews`,
        { rating: review.rating, comment: review.comment, name: review.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Ensure reviews is updated correctly
      setReviews((prevReviews) => [...prevReviews, response.data]);
      setReview({ rating: 0, comment: "", name: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to submit review.");
    }
  };

  const handleRatingChange = (rating) => {
    setReview({ ...review, rating });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  } 
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Product Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 grid md:grid-cols-2 gap-6">
        <img
          src={product.image || defaultProfile}
          alt={product.name}
          className="w-full h-96 object-cover rounded"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.category}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-gray-900 mb-6">₹{product.price}</p>
          <button
            onClick={() => handleAddToCart(product)}
            className="bg-green-500 text-white py-3 px-6 rounded hover:bg-green-600 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Products</h2>
        <div className="flex overflow-x-auto space-x-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md p-4"
              >
                <img
                  src={product.image || defaultProfile}
                  alt="Related Product"
                  className="w-full h-40 object-cover mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">{product.category}</p>
                <p className="text-xl font-semibold text-gray-900">₹{product.price}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No related products found.</p>
          )}
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  {review.name} <span className="text-yellow-400">{review.rating}★</span>
                </h3>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this product!</p>
          )}

          {/* Review Form */}
          <form onSubmit={handleReviewSubmit} className="mt-6">
            <div className="flex flex-col space-y-4">
              {/* Name Input */}
              <input
                type="text"
                value={review.name}
                onChange={(e) => setReview({ ...review, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Your Name"
              />

              {/* Rating Input with Stars */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={review.rating >= star ? "yellow" : "gray"}
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    onClick={() => handleRatingChange(star)}
                    className="cursor-pointer"
                  >
                    <path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z" />
                  </svg>
                ))}
              </div>

              {/* Comment Input */}
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Your review"
              />

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
