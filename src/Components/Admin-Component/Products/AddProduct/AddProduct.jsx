import React, { useState } from 'react';
import './AddProduct.css';

function AddProduct({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        description: '',
        categoryId: '1' // Default to a valid ID (e.g., 1 for 'Full Face')
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            name: formData.name,
            price: parseFloat(formData.price),
            image: formData.image,
            description: formData.description,
            categoryId: parseInt(formData.categoryId) 
        };
        onSave(newProduct);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Add New Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoryId">Category</label>
                        <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange}>
                            {/* Update these values based on your actual database IDs for categories */}
                            <option value="1">Full Face</option>
                            <option value="2">Open Face</option>
                            <option value="3">Junior</option>
                            <option value="4">Women</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input type="number" step="0.01" id="price" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Image URL</label>
                        <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save">Add Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;