import React, { useState, useEffect } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import './Products.css';
import ProductList from './ProductList/ProductList';
import AddProduct from './AddProduct/AddProduct';
import api from "../../../api/api";

const API_BASE_URL = "http://localhost:5000/api";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/product/GetAll-Product`);
      const data = await response.json();

      // 🔥 Sort newest first
      setProducts(
        data.sort((a, b) => b.id - a.id)
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 Add Product
  const handleAddProduct = async (newProductData) => {
    try {
      // 🔍 Read token safely
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You are not logged in!");
        return;
      }

      const response = await api.post(
        `${API_BASE_URL}/product/Add-Product`,
        newProductData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const createdProduct = response.data.data;

      // 🔥 Instantly update UI
      setProducts(prev => [createdProduct, ...prev]);

      toast.success("Product added successfully!");
      setIsAddModalOpen(false);

    } catch (err) {
      console.error("Add Product Error:", err);

      if (err.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else {
        toast.error("Failed to add product.");
      }
    }
  };

  return (
    <div className="products-view">
      <div className="products-header">
        <h2 className='products-title'>Products</h2>
        <button
          className="add-product-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusCircle size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="product-list">
        <ProductList
          searchTerm={searchTerm}
          products={products}
          setProducts={setProducts}
          loading={loading}
          error={error}
        />
      </div>

      {isAddModalOpen && (
        <AddProduct
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProduct}
        />
      )}
    </div>
  );
}

export default Products;