import React, { useState, useEffect } from 'react';

function EditProduct({ product, onSave, onClose }) {
  // Initialize formData with the product passed in.
  // Ensure description has a default empty string if not present.
  const [formData, setFormData] = useState({ 
    ...product,
    description: product.description || '', // Ensure description exists
    category: product.category || 'Full Face' // Default category if not set
  });

  // Update formData when the 'product' prop changes (e.g., when editing a different product)
  useEffect(() => {
    setFormData({ 
      ...product,
      description: product.description || '',
      category: product.category || 'Full Face' 
    });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure price is parsed as a float before saving
    // You might also want to do validation here
    onSave({ ...formData, price: parseFloat(formData.price) });
  };

  // Define your helmet categories
  const helmetCategories = [
    'Full Face',
    'Open Face',
    'Modular',
    'Off-Road',
    'Half Helmet',
    'Dual Sport',
    'Kids Helmets'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}> 
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
            >
              {helmetCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input 
              type="number" 
              step="0.01" 
              id="price" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4" // You can adjust the number of rows
              required
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;