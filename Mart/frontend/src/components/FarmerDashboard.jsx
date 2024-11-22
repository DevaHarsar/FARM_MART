
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
} from "../services/api"; // Ensure these functions are correctly implemented in api.js
import "./FarmerDashboard.css"; // Import CSS for styling
import defaultProfile from "./img/pic1.jpg";
const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    profileImage: "",
  });
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch the farmer's products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getFarmerProducts();
        setProducts(response.data); // Assuming the response is in `data`
      } catch (err) {
        setDashboardError("Error fetching products");
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await getFarmerProfile();
        setProfile(response.data); // Assuming the response is in `data`
      } catch (err) {
        setProfileError("Error fetching profile information");
      }
    };

    fetchProducts();
    fetchProfile();
  }, []);

  // Handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { name, description, price, image } = newProduct;
      const response = await addProduct({ name, description, price, image });
      setNewProduct({ name: "", description: "", price: "", image: "" });
      alert("Product added successfully!");
      setProducts([...products, response.data]);
    } catch (err) {
      setDashboardError("Failed to add product");
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (id) => {
    try {
     const del =  await deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));
      if(del) alert("Product Deleted Sucessfully");
    } catch (err) {
      setDashboardError("Failed to delete product");
    }
  };

  // Handle updating farmer profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await updateFarmerProfile(profile);
      alert("Profile updated successfully!");
      setProfile(response.data);
      setIsProfileDialogOpen(false); // Close dialog on successful update
    } catch (err) {
      setProfileError("Failed to update profile");
    }
  }; 
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const { name, description, price, image } = newProduct;
      await updateProduct(editingProduct._id, { name, description, price, image });
      alert("Product updated successfully!");
      setProducts(products.map((product) =>
        product._id === editingProduct._id ? { ...product, name, description, price, image } : product
      ));
      setEditingProduct(null); // Clear the editing state
    } catch (err) {
      setDashboardError("Failed to update product");
    }
  };

  const handleStartEditing = async (id) => {
    try {
      const response = await getProductById(id);
      console.log(response);
  
      if (!response || !response.data) {
        throw new Error("Invalid response from API");
      }
  
      setEditingProduct(response.data);
      setNewProduct(response.data); // Pre-fill the form with product data
    } catch (err) {
      setDashboardError("Failed to fetch product details");
      console.error(err);
    }
  };
  
  return (
    <div className="farmer-dashboard-container">
      {/* Header */}
      <div className="farmer-dashboard-header">
        <h2>Farmer Dashboard</h2>
        
        {/* Profile Icon */}
        <div
          className="profile-icon"
          onClick={() => setIsProfileDialogOpen(true)}
        >
          <img
            src={profile.profileImage || defaultProfile} // Default image if no profile image
            alt="Profile"
            className="profile-image"
          />
        </div>
      </div>

      {/* Profile Dialog */}
      {isProfileDialogOpen && (
        <div className="profile-dialog">
          <div className="dialog-content">
            <h3>Update Profile</h3>
            {profileError && <p className="error-message">{profileError}</p>}
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Profile Image URL</label>
                <input
                  type="url"
                  value={profile.profileImage}
                  onChange={(e) =>
                    setProfile({ ...profile, profileImage: e.target.value })
                  }
                />
              </div>
              <button type="submit">Update Profile</button>
              <button
                type="button"
                className="close-dialog"
                onClick={() => setIsProfileDialogOpen(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    <div className="add-product-form">
        <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
        {dashboardError && <p className="error-message">{dashboardError}</p>}
        <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />
          </div>
          <button type="submit">{editingProduct ? "Update Product" : "Add Product"}</button>
        </form>
      </div>

      {/* Product List Section */}
      <div className="product-list">
        <h3>Your Products</h3>
        {products.length === 0 ? (
          <p>No products added yet. Start by adding one!</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <div className="product-actions">
                  <button onClick={() => handleDeleteProduct(product._id)}>
                    Delete
                  </button>
                  <button onClick={() => handleStartEditing(product._id)}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;

