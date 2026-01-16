import React, { useState, useEffect } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import './Products.css';
import ProductList from './ProductList/ProductList';
import AddProduct from './AddProduct/AddProduct';
function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (newProductData) => {
    try {
      const response = await axios.post('http://localhost:5298/api/AdminProduct/add', newProductData);
      setProducts(prev => [...prev, response.data.data]);
      toast.success('Product added!');
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error("Admin access denied or server error");
    }
  };

  return (
    <div className="products-view">
      <div className="products-header">
        <h2 className='products-title'>Products</h2>
        <button className="add-product-btn" onClick={() => setIsAddModalOpen(true)}>
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