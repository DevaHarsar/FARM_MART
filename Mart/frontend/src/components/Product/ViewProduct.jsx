import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getRelatedProducts, addReview, getReviews } from "../../services/api";
import "../Product/product.css";
import defaultProfile from "../img/pic1.jpg";

const ViewProduct = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [review, setReview] = useState({ rating: 0, comment: "", });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response);
      } catch (err) {
        if (err.response.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to load product details");
        }
      } finally {
        setLoading(false);
      }
    };
  
    const fetchRelatedProducts = async () => {
      try {
        const response = await getRelatedProducts(id);
        setRelatedProducts(response);
      } catch (err) {
        if (err.response.status === 404) {
          setRelatedProducts([]); // Set to empty array if not found
        } else {
          setError("Failed to load related products");
        }
      }
    };
  
    const fetchReviews = async () => {
      try {
        const response = await getReviews(id);
        setReviews(response);
      } catch (err) {
        if (err.response.status === 404) {
          setReviews([]); // Set to empty array if not found
        } else {
          setError("Failed to load reviews");
        }
      }
    };
  
  
    fetchProduct();
    fetchRelatedProducts();
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addReview(id, review);
      setReviews([...reviews, response]);
      setReview({ rating: 0, comment: "", });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-500">Loading...</p>
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Product Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 grid md:grid-cols-2 gap-6">
        <img src={product.image || defaultProfile} alt={product.name} className="w-full h-96 object-cover rounded" />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.category}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-gray-900 mb-6">₹{product.price}</p>
          <button onClick={() => addToCart(product)} className="bg-green-500 text-white py-3 px-6 rounded hover:bg-green-600 transition duration-300" > 
            Add to Cart 
          </button>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Products</h2>
        <div className="flex overflow-x-auto space-x-4">
          {
            relatedProducts.length > 0 ? 
            relatedProducts.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md p-4" >
                <img src={product.image || defaultProfile} alt="Related Product" className="w-full h-40 object-cover mb-4" />
                <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">{product.category}</p>
                <p className="text-xl font-semibold text-gray-900">₹{product.price}</p>
                <button onClick={() => addToCart(product)} className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300" > 
                  Add to Cart 
                </button>
              </div>
            ))
            : 
            <p className="text-gray-600">No related products found.</p>
          }
        </div>
      </div>

{/* Customer Reviews */}
<div className="mt-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
  <div className="bg-white rounded-lg shadow-md p-6">
    {/* {
      reviews.length > 0 ? 
      reviews.map((review) => (
        <div key={review._id} className="mb-6">
          <h3 className="text-lg font-bold text-gray-800"> 
            {review.name} ({review.rating}/5) 
          </h3>
          <p className="text-gray-600">{review.comment}</p>
        </div>
      ))
      : 
      <p className="text-gray-600">No reviews yet.</p>
    } */}
    {/* Review submission form */}
    <form onSubmit={handleReviewSubmit} className="mt-4">
      <textarea 
        type="text" 
        value={review.comment} 
        onChange={(e) => setReview({ ...review, comment: e.target.value })} 
        className="w-full p-3 border border-gray-300 rounded mb-3" 
        placeholder="Write your review..."
      />
      <select 
        value={review.rating} 
        onChange={(e) => setReview({ ...review, rating: e.target.value })} 
        className="w-full p-3 border border-gray-300 rounded mb-3" 
      >
        <option value="0">Rating (0-5)</option>
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}> 
            {num} 
          </option>
        ))}
      </select>
      <button 
        type="submit" 
        className="bg-green-500 text-white py-3 px-6 rounded hover:bg-green-600 transition duration-300" 
      > 
        Submit Review 
      </button>
    </form>
  </div>
</div>
</div>
);
};

export default ViewProduct;


