import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFarmerProducts,
  addProduct,
  deleteProduct,
  getFarmerProfile,
  updateFarmerProfile,
  getProductById,
  updateProduct,
} from "../services/api";
import "./FarmerDashboard.css";
import defaultProfile from "./img/pic1.jpg";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    visibility: "visible",
    basePrice: 0,
    prices: { "1kg": 0, "500g": 0, "250g": 0 },
  });
  const [categories] = useState(["Fruits", "Vegetables", "Grains", "Dairy"]);
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    profileImage: "",
  });
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getFarmerProducts();
        setProducts(response.data);
      } catch (err) {
        setDashboardError("Error fetching products");
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await getFarmerProfile();
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile information");
      }
    };

    fetchProducts();
    fetchProfile();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { name, description, image, category, visibility, prices } = newProduct;
      const quantityOptions = Object.keys(prices).map((weight) => ({
        quantity: weight,
        basePrice: prices[weight],
      }));
      const response = await addProduct({ name, description, image, category, visibility, quantityOptions });
      setNewProduct({
        name: "",
        description: "",
        image: "",
        category: "",
        visibility: "visible",
        basePrice: 0,
        prices: { "1kg": 0, "500g": 0, "250g": 0 },
      });
      alert("Product added successfully!");
      setProducts([...products, response.data]);
    } catch (err) {
      setDashboardError("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const del = await deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));
      if (del) alert("Product Deleted Successfully");
    } catch (err) {
      setDashboardError("Failed to delete product");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await updateFarmerProfile(profile);
      alert("Profile updated successfully!");
      setProfile(response.data);
      setIsProfileDialogOpen(false);
    } catch (err) {
      setDashboardError("Failed to update profile");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const { name, description, image, category, visibility, prices } = newProduct;
      await updateProduct(editingProduct._id, {
        name,
        description,
        image,
        category,
        visibility,
        prices,
      });
      alert("Product updated successfully!");
      setProducts(
        products.map((product) =>
          product._id === editingProduct._id
            ? { ...product, name, description, image, category, visibility, prices }
            : product
        )
      );
      setEditingProduct(null);
      setNewProduct({
        name: "",
        description: "",
        image: "",
        category: "",
        visibility: "visible",
        basePrice: 0,
        prices: { "1kg": 0, "500g": 0, "250g": 0 },
      });
    } catch (err) {
      setDashboardError("Failed to update product");
    }
  };

  const handleStartEditing = async (productId) => {
    try {
      const productData = await getProductById(productId);
      setEditingProduct(productData);
      setNewProduct(productData);
    } catch (err) {
      setDashboardError("Failed to fetch product details");
      console.error(err);
    }
  };

  const handleBasePriceChange = (e) => {
    const basePrice = parseFloat(e.target.value);
    const calculatedPrices = {
      "1kg": basePrice,
      "500g": basePrice / 2,
      "250g": basePrice / 4,
    };
    setNewProduct({ ...newProduct, basePrice, prices: calculatedPrices });
  };

  const handlePriceChange = (e, weight) => {
    const updatedPrices = { ...newProduct.prices };
    updatedPrices[weight] = parseFloat(e.target.value);
    setNewProduct({ ...newProduct, prices: updatedPrices });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.value });
  };

  const handleProfileImageChange = (e) => {
    setProfile({ ...profile, profileImage: e.target.value });
  };

  return (
    <div className="farmer-dashboard-container bg-gray-50">
      <div className="farmer-dashboard-header flex justify-between items-center p-4 bg-green-600 text-white">
        <h2 className="text-2xl font-bold">Farmer Dashboard</h2>
        <div
          className="profile-icon cursor-pointer"
          onClick={() => setIsProfileDialogOpen(true)}
        >
          <img
            src={profile.profileImage || defaultProfile}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
        </div>
      </div>

      <div className="add-product-form p-6 bg-white rounded-lg shadow-lg mt-6 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
        {dashboardError && <p className="text-red-500 mb-4">{dashboardError}</p>}
        <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="grid grid-cols-1 gap-6">
          <div className="form-group">
            <label className="block text-gray-700 font-medium">Product Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="form-group">
            <label className="block text-gray-700 font-medium">Product Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="form-group">
            <label className="block text-gray-700 font-medium">Product Image URL</label>
            <input
              type="url"
              value={newProduct.image}
              onChange={handleImageChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="form-group">
            <label className="block text-gray-700 font-medium">Product Category</label>
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* Conditionally render base price only when not editing */}
          {!editingProduct && (
            <div className="form-group">
              <label className="block text-gray-700 font-medium">Base Price</label>
              <input
                type="number"
                value={newProduct.basePrice}
                onChange={handleBasePriceChange}
                min="0"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
          <div className="form-group">
            <label className="block text-gray-700 font-medium">Visibility</label>
            <select
              value={newProduct.visibility}
              onChange={(e) =>
                setNewProduct({ ...newProduct, visibility: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
          <div className="price-group grid grid-cols-3 gap-4">
            {Object.keys(newProduct.prices).map((weight) => (
              <div key={weight} className="form-group">
                <label className="block text-gray-700 font-medium">{weight} Price</label>
                <input
                  type="number"
                  value={newProduct.prices[weight]}
                  onChange={(e) => handlePriceChange(e, weight)}
                  min="0"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      <div className="product-list mt-8">
        <h3 className="text-xl font-semibold mb-4">Your Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="product-card bg-white p-4 rounded-lg shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover mb-4 rounded-lg"
              />
              <h4 className="text-lg font-semibold">{product.name}</h4>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-fuchsia-900 text-lg">{product.visibility}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-semibold">₹{product.prices.price_1kg} per kg</span>
                <button
                  className="text-blue-500 rounded-full border-2 border-blue-500 bg-yellow-200 py-2 px-6 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => handleStartEditing(product._id)}
                >
                  Edit
                </button>
                <button
                  className="text-white rounded-full border-2 border-red-500 bg-red-500  py-2 px-6 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
