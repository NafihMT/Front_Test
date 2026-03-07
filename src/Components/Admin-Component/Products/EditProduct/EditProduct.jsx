import React, { useState, useEffect } from 'react';
import './EditProduct.css';

const API_BASE_URL = "http://localhost:5000/api";

function EditProduct({ product, onSave, onClose }) {

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    imageUrl: '',
    description: '',
    categoryId: ''
  });

  // 🔥 Load categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        setCategories(data.data ?? data ?? []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // 🔥 Set product data when modal opens
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || '',
        description: product.description || '',
        categoryId: product.category?.id || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? value : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProduct = {
      id: formData.id,
      name: formData.name,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl,
      description: formData.description,
      categoryId: parseInt(formData.categoryId)
    };

    onSave(updatedProduct);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Edit Product</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProduct;