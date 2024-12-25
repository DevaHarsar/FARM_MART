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
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
    name: "",
  });
  const [selectedPrice, setSelectedPrice] = useState(null);

  // Fetch product details, related products, and reviews
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response);
        setSelectedPrice(response.prices?.price_1kg); // Default to 1kg price
        setSelectedWeight("1kg")
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
        setReviews(Array.isArray(response) ? response : []);
      } catch (err) {
        setError("Failed to load reviews");
      }
    };

    fetchProduct();
    fetchRelatedProducts();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async (product) => {

    if (!selectedPrice || !selectedWeight) {
      alert("Please select a valid product weight.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Please log in.");
      }
      const quantity = 1;
      const total = selectedPrice * quantity;
     

      const response = await axios.post(
        `${API_URL}/cart/add`,
        {
          productId: product._id,
          quantity: quantity,
          weight: selectedWeight,
          price: selectedPrice, // Pass the selected weight to the backend
          total: total,

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     
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

      // Ensure reviews are updated correctly
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

  // Update price selection based on the chosen quantity
  const handlePriceSelection = (quantity) => {
    if (quantity === "1kg") {
      setSelectedPrice(product.prices?.price_1kg);
      setSelectedWeight("1kg");
    } else if (quantity === "500g") {
      setSelectedPrice(product.prices?.price_500g);
      setSelectedWeight("500g");
    } else if (quantity === "250g") {
      setSelectedPrice(product.prices?.price_250g);
      setSelectedWeight("250g");
    }
    
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
          <div className="mb-6">
            {/* 1kg Button */}
            <button
              onClick={() => handlePriceSelection("1kg")}
              className={`mr-4 ${selectedWeight === "1kg" ? "bg-green-800" : "bg-green-500"} text-white py-2 px-4 rounded`}
            >
              1kg
            </button>

            {/* 500g Button */}
            <button
              onClick={() => handlePriceSelection("500g")}
              className={`mr-4 ${selectedWeight === "500g" ? "bg-green-800" : "bg-green-500"} text-white py-2 px-4 rounded`}
            >
              500g
            </button>

            {/* 250g Button */}
            <button
              onClick={() => handlePriceSelection("250g")}
              className={`mr-4 ${selectedWeight === "250g" ? "bg-green-800" : "bg-green-500"} text-white py-2 px-4 rounded`}
            >
              250g
            </button>
          </div>

          {/* Display selected price */}
          <p className="text-2xl font-semibold text-gray-900 mb-6">
            ₹{selectedPrice || "Select a weight"}
          </p>

          {/* Add to Cart Button */}
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
                <p className="text-xl font-semibold text-gray-900">₹{product.prices?.price_1kg}</p>
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
              <div key={review._id} className="mb-4 border-b pb-4">
                <div className="flex items-center">
                  <img
                    src={defaultProfile}
                    alt={review.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <p className="text-lg font-semibold">{review.name}</p>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
                <div className="flex mt-2">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <span key={index} className="text-yellow-500">&#9733;</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>

      {/* Review Form */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Leave a Review</h2>
        <form onSubmit={handleReviewSubmit} className="bg-white rounded-lg shadow-md p-6">
          <label className="block mb-2 text-gray-700">Your Name</label>
          <input
            type="text"
            value={review.name}
            onChange={(e) => setReview({ ...review, name: e.target.value })}
            className="w-full mb-4 p-3 border border-gray-300 rounded"
            placeholder="Enter your name"
          />
          <label className="block mb-2 text-gray-700">Your Rating</label>
          <div className="mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`mr-2 ${review.rating >= star ? "text-yellow-500" : "text-gray-400"}`}
              >
                &#9733;
              </button>
            ))}
          </div>
          <label className="block mb-2 text-gray-700">Your Review</label>
          <textarea
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            className="w-full mb-4 p-3 border border-gray-300 rounded"
            placeholder="Enter your review"
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition duration-300"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ViewProduct;
