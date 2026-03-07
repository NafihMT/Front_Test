import React, { useState, useEffect } from 'react';
import './AddProduct.css';

const API_BASE_URL = "http://localhost:5000/api";

function AddProduct({ onClose, onSave }) {

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        description: '',
        categoryId: ''
    });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`);
                const data = await res.json();

                const categoryList = data.data ?? data ?? [];
                setCategories(categoryList);

                if (categoryList.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        categoryId: categoryList[0].id.toString()
                    }));
                }

            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProduct = {
            name: formData.name,
            price: parseFloat(formData.price),
            imageUrl: formData.image,
            description: formData.description,
            categoryId: parseInt(formData.categoryId)
        };

        onSave(newProduct);   // 🔥 Send to parent
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Add New Product</h2>

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
                            name="image"
                            value={formData.image}
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
                            rows="3"
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
                        <button type="submit" className="btn-save">
                            Add Product
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddProduct;